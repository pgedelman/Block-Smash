import torch
import numpy as np
from datetime import datetime
import os
from smash_bot_model import SmashBotModel, initialize_population, select_top_performers, reproduce, mutate, save_model

with open("train-loop-log.txt", "at") as tlinfo:
    tlinfo.write("\nStart of training loop\n")

input_dim = 4
output_dim = 1
pop_size = 50
generations = 50
evaluations_per_generation = pop_size
best_score = 0

population = initialize_population(pop_size, input_dim, output_dim)
fitness_scores = [0] * pop_size
current_model_index = 0
current_generation = 0
current_evaluations = 0
model_iteration = 0

grid = emptyGrid()
blocks = getBlocks()
data = getData(grid, blocks)


start_time = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

def train():
    global current_model_index, current_generation, current_evaluations, model_iteration, start_time
    global population, fitness_scores, best_score

    if not os.path.exists(f'./saved-models/{start_time}'):
        os.makedirs(f'./saved-models/{start_time}')

    data = 
    metrics = data['metrics']
    numberOfMoves = data['numberOfMoves']
    score = data['score']
    fitness_scores[current_model_index] = score

    if current_generation >= generations:
        return jsonify([-3, -6, -6, -3])
    if numberOfMoves == 0 or not len(metrics):
        model_iteration += 1
        with open("train-loop-log.txt", "at") as tlinfo:
            tlinfo.write(f'Iteration: {model_iteration}.\n')
        if score >= best_score:
            torch.save(population[current_model_index].state_dict(), f'./saved-models/{start_time}/{model_iteration}.pth')
            with open("train-loop-log.txt", "at") as tlinfo:
                tlinfo.write(f'Saved model, score: {score}.\n')
            app.logger.info('Saved model')
            best_score = score
        current_model_index += 1
        current_evaluations += 1

        if current_evaluations >= evaluations_per_generation:
            app.logger.info(f'Generation {current_generation}: Best Score = {max(fitness_scores)}')
            with open("train-loop-log.txt", "at") as tlinfo:
                tlinfo.write(f'Generation {current_generation}: Best Score = {max(fitness_scores)}\n')
            top_models = select_top_performers(population, fitness_scores, top_k=10)
            population = reproduce(top_models, pop_size)
            fitness_scores = [0] * pop_size
            current_generation += 1
            current_evaluations = 0
            current_model_index = 0
        return jsonify([-1, -1, -1, -1]), 200

    model = population[current_model_index]
    response = None
    for state in metrics:
        state_tensor = torch.tensor(state, dtype=torch.float).unsqueeze(0)
        with torch.no_grad():
            output = model(state_tensor)
            response = [state_tensor.tolist(), output.item()] if response == None or output.item() >= response[1] else response
    return jsonify(response[0]), 200

train()