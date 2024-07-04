import torch
import torch.nn as nn
import numpy as np

class SmashBotModel(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(SmashBotModel, self).__init__()
        self.fc1 = nn.Linear(input_dim, 1024)
        self.fc2 = nn.Linear(1024, 1024)
        self.fc3 = nn.Linear(1024, 1024)
        self.output = nn.Linear(1024, output_dim)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = torch.relu(self.fc3(x))
        return self.output(x)

def initialize_population(pop_size, input_dim, output_dim):
    population = []
    for _ in range(pop_size):
        model = SmashBotModel(input_dim, output_dim)
        population.append(model)
    return population

def mutate(model, mutation_rate=0.01):
    for param in model.parameters():
        if len(param.shape) > 1:# Only mutate weights, not biases
            mutation_mask = torch.rand_like(param) < mutation_rate
            param.data += mutation_mask * torch.randn_like(param)

def select_top_performers(population, fitness_scores, top_k):
    top_indices = np.argsort(fitness_scores)[-top_k:]
    top_models = [population[i] for i in top_indices]
    return top_models

def reproduce(top_models, pop_size):
    new_population = []
    for model in top_models:
        for _ in range(pop_size // len(top_models)):
            new_model = SmashBotModel(model.fc1.in_features, model.output.out_features)
            new_model.load_state_dict(model.state_dict())
            mutate(new_model)
            new_population.append(new_model)
    return new_population

def save_model(model_path, population):
    torch.save(population[0].state_dict(), model_path)
    print(f'Trained model saved to {model_path}')

type_options = {'1':64, '2':60, '3':81, '4':81, '5':81, '6':81, '7':81, '8':100, '9':70, '10':60, '11':70, '12':72, '13':72, '14':90, '15':64, '16':64, '17':64, '18':64, '19':80, '20':80, '21':90}
def index_to_response(index):
    for blockType in type_options:
        index -= type_options[blockType]
        if index < 0:
            return[int(blockType), index + type_options[blockType]]
