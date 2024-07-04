from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import torch
import numpy as np
from smash_bot_model import SmashBotModel, initialize_population, select_top_performers, reproduce, mutate, save_model, index_to_response, type_options

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

input_dim = 1669
output_dim = 1569
pop_size = 100
generations = 50
evaluations_per_generation = pop_size

population = initialize_population(pop_size, input_dim, output_dim)
fitness_scores = [0] * pop_size
current_model_index = 0
current_generation = 0
current_evaluations = 0

@app.route('/predict', methods=['POST'])
def predict():
    global current_model_index, current_generation, current_evaluations
    global population, fitness_scores

    data = request.json
    app.logger.info(f'Received Data: {data}')

    state = data['grid']
    valid_action_mask = []
    for block_type in type_options:
        if block_type in data['options']:
            state.extend(int(option != [-1, -1]) for option in data['options'][block_type])
            valid_action_mask.extend(int(option != [-1, -1]) for option in data['options'][block_type])
        else:
            state.extend([0] * type_options[block_type])
            valid_action_mask.extend([0] * type_options[block_type])
    app.logger.info(f'State: {state}')
    app.logger.info(f'Valid Action Mask: {valid_action_mask}')

    points = data['points']
    num_options = data['num_options']
    fitness_scores[current_model_index] = points

    if num_options == 0:
        # Move to the next model
        current_model_index += 1
        current_evaluations += 1

        if current_evaluations >= evaluations_per_generation:
            # End of generation, reproduce and start a new generation
            top_models = select_top_performers(population, fitness_scores, top_k=10)
            population = reproduce(top_models, pop_size)
            fitness_scores = [0] * pop_size
            current_generation += 1
            current_evaluations = 0
            current_model_index = 0
            app.logger.info(f'Generation {current_generation}: Best Score = {max(fitness_scores)}')
        return jsonify([-1, -1]), 200

    model = population[current_model_index]
    state_tensor = torch.tensor(state, dtype=torch.float).unsqueeze(0)  # Add batch dimension
    valid_action_mask_tensor = torch.tensor(valid_action_mask, dtype=torch.float).unsqueeze(0)  # Add batch dimension

    with torch.no_grad():
        output = model(state_tensor)
        masked_output = output * valid_action_mask_tensor  # Mask invalid actions
        action = masked_output.argmax(dim=1).item()
        app.logger.info(f'Raw Output: {output}')
        app.logger.info(f'Masked Output: {masked_output}')
        app.logger.info(f'Selected Action: {action}')

    response = index_to_response(action)
    app.logger.info(f'Response: {response}')
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

save_model('smash-bot.pth', population)
