type Gene = string;
type Genotype = Gene[];

function getRandomChar(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz ';
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

function generateGenotype(target: string): Genotype {
    const genotype: Genotype = [];

    for (let i = 0; i < target.length; i++) {
        const char = getRandomChar();
        genotype.push(char);
    }

    return genotype;
}

function appendText(text: string): void {
    document.body.appendChild(document.createTextNode(text));
    document.body.appendChild(document.createElement('br'));
}

function printGenotype(genotype: Genotype, target: string): void {
    const result = `Text: "${genotype.join('')}". Fitness: ${Math.round(
        getFintnessScore(genotype, target) * 100,
    )}%`;
    appendText(result);
}

function getFintnessScore(genotype: Genotype, target: string): number {
    return (
        [...target].reduce((score, char, i) => score + (char === genotype[i] ? 1 : 0), 0) /
        target.length
    );
}

function getMatingPool(population: Genotype[], target: string): Genotype[] {
    const matingPool: Genotype[] = [];

    for (let i = 0; i < population.length; i++) {
        const fitness = getFintnessScore(population[i], target) * 100;
        for (let j = 0; j < fitness; j++) {
            matingPool.push(population[i]);
        }
    }

    return matingPool;
}

function crossover(parent1: Genotype, parent2: Genotype): Genotype {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    const child: Genotype = [];

    for (let i = 0; i < parent1.length; i++) {
        if (i > crossoverPoint) {
            child.push(parent1[i]);
        } else {
            child.push(parent2[i]);
        }
    }

    return child;
}

function mutate(genotype: Genotype, mutationRate: number): Genotype {
    const mutatedGenotype: Genotype = [];

    for (let i = 0; i < genotype.length; i++) {
        if (Math.random() < mutationRate) {
            mutatedGenotype.push(getRandomChar());
        } else {
            mutatedGenotype.push(genotype[i]);
        }
    }

    return mutatedGenotype;
}

function reproduce(
    population: Genotype[],
    matingPool: Genotype[],
    mutationRate: number,
): Genotype[] {
    const children: Genotype[] = [];

    for (let i = 0; i < population.length; i++) {
        const parent1 = matingPool[Math.floor(Math.random() * matingPool.length)];
        const parent2 = matingPool[Math.floor(Math.random() * matingPool.length)];
        let child = crossover(parent1, parent2);
        child = mutate(child, mutationRate);
        children.push(child);
    }

    return children;
}

function main() {
    const target = 'To be or not to be';
    const mutationRate = 0.01;
    const totalPopulation = 150;
    const generations = 200;
    let population: Genotype[] = [];

    for (let i = 0; i < totalPopulation; i++) {
        population.push(generateGenotype(target));
    }

    for (let i = 0; i < generations; i++) {
        const matingPool = getMatingPool(population, target);
        population = reproduce(population, matingPool, mutationRate);
    }

    appendText(`Target: "${target}" Generations: ${generations}. Mutation rate: ${mutationRate}`);
    appendText('');
    appendText('Results:');

    for (const genotype of population.sort(
        (a, b) => getFintnessScore(b, target) - getFintnessScore(a, target),
    )) {
        printGenotype(genotype, target);
    }
}

main();
