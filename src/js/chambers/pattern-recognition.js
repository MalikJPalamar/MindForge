/**
 * Pattern Recognition Chamber
 * Puzzles focused on identifying visual, numerical, and logical patterns
 */

class PatternRecognitionGenerator {
    static generatePuzzles() {
        const puzzles = [];

        // Visual Pattern Puzzles (1-8)
        puzzles.push(...this.generateVisualPatterns());

        // Number Sequence Puzzles (9-16)
        puzzles.push(...this.generateNumberSequences());

        // Shape Pattern Puzzles (17-25)
        puzzles.push(...this.generateShapePatterns());

        return puzzles;
    }

    static generateVisualPatterns() {
        return [
            {
                id: 'pattern_recognition_1',
                title: 'Color Sequence Pattern',
                difficulty: 'easy',
                question: 'What color comes next in this sequence: Red, Blue, Red, Blue, Red, ?',
                type: 'multiple-choice',
                options: ['Red', 'Blue', 'Green', 'Yellow'],
                correctAnswer: 1,
                explanation: 'This is an alternating pattern: Red, Blue, Red, Blue, Red... so Blue comes next.',
                hints: [
                    'Look at how the colors alternate in the sequence.',
                    'Notice the pattern: Red → Blue → Red → Blue → Red → ?',
                    'The pattern alternates between two colors consistently.'
                ],
                timeLimit: 120,
                points: 10,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_2',
                title: 'Geometric Progression',
                difficulty: 'easy',
                question: 'In this pattern ○○○ ○○ ○ ?, how many circles should be in the next group?',
                type: 'multiple-choice',
                options: ['0 circles', '1 circle', '2 circles', '4 circles'],
                correctAnswer: 0,
                explanation: 'The pattern decreases by 1 circle each time: 3, 2, 1, 0.',
                hints: [
                    'Count the circles in each group: 3, 2, 1...',
                    'The number of circles decreases by 1 each time.',
                    'Following the pattern: 3 → 2 → 1 → 0'
                ],
                timeLimit: 90,
                points: 10,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_3',
                title: 'Triangle Pattern',
                difficulty: 'easy',
                question: 'Following the pattern ▲ ▲▲ ▲▲▲ ?, how many triangles should be in the next group?',
                type: 'multiple-choice',
                options: ['3 triangles', '4 triangles', '5 triangles', '6 triangles'],
                correctAnswer: 1,
                explanation: 'The pattern increases by 1 triangle each time: 1, 2, 3, 4.',
                hints: [
                    'Count the triangles in each group.',
                    'The number increases by 1 each time.',
                    'The sequence is: 1, 2, 3, so next is 4.'
                ],
                timeLimit: 90,
                points: 10,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_4',
                title: 'Letter Pattern Recognition',
                difficulty: 'medium',
                question: 'What letter comes next in this sequence: A, C, E, G, ?',
                type: 'multiple-choice',
                options: ['H', 'I', 'J', 'K'],
                correctAnswer: 1,
                explanation: 'This sequence skips one letter each time: A(+2)C(+2)E(+2)G(+2)I.',
                hints: [
                    'Look at the positions of the letters in the alphabet.',
                    'Each letter is 2 positions ahead of the previous one.',
                    'A(1) → C(3) → E(5) → G(7) → I(9)'
                ],
                timeLimit: 150,
                points: 15,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_5',
                title: 'Size Pattern',
                difficulty: 'medium',
                question: 'In this pattern of squares: Large, Medium, Small, Large, Medium, ?, what comes next?',
                type: 'multiple-choice',
                options: ['Large', 'Medium', 'Small', 'Extra Large'],
                correctAnswer: 2,
                explanation: 'The pattern repeats every 3 items: Large, Medium, Small, then repeats.',
                hints: [
                    'Look for a repeating cycle in the sizes.',
                    'The pattern is: Large → Medium → Small → Large → Medium → ?',
                    'This is a 3-item cycle that repeats.'
                ],
                timeLimit: 120,
                points: 15,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_6',
                title: 'Direction Pattern',
                difficulty: 'medium',
                question: 'Following this arrow pattern: → ↓ ← ↑ → ?, what direction comes next?',
                type: 'multiple-choice',
                options: ['↑ (Up)', '→ (Right)', '↓ (Down)', '← (Left)'],
                correctAnswer: 2,
                explanation: 'The arrows rotate clockwise: Right → Down → Left → Up → Right → Down.',
                hints: [
                    'Notice how the arrows turn in a specific direction.',
                    'The arrows rotate clockwise around a circle.',
                    'Right → Down → Left → Up → Right → Down'
                ],
                timeLimit: 150,
                points: 15,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_7',
                title: 'Complex Color Pattern',
                difficulty: 'hard',
                question: 'What comes next in: Red Red, Blue Blue Blue, Green Green Green Green, ?',
                type: 'multiple-choice',
                options: [
                    'Yellow Yellow Yellow Yellow Yellow',
                    'Purple Purple Purple',
                    'Orange Orange',
                    'Black'
                ],
                correctAnswer: 0,
                explanation: 'Each color appears a number of times equal to its position: Red(2), Blue(3), Green(4), so Yellow should appear 5 times.',
                hints: [
                    'Count how many times each color appears.',
                    'Red appears 2 times, Blue 3 times, Green 4 times...',
                    'The pattern increases by 1 each time: 2, 3, 4, 5'
                ],
                timeLimit: 180,
                points: 20,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_8',
                title: 'Symbol Rotation',
                difficulty: 'hard',
                question: 'In this pattern of rotating symbols: ◐ ◑ ◒ ◓ ?, what comes next?',
                type: 'multiple-choice',
                options: ['◐', '◑', '◒', '◓'],
                correctAnswer: 0,
                explanation: 'The symbol rotates 90° clockwise each time, completing a full rotation and starting over.',
                hints: [
                    'Notice how the shaded part of the circle rotates.',
                    'Each step is a 90-degree clockwise rotation.',
                    'After 4 steps (360°), the pattern repeats from the beginning.'
                ],
                timeLimit: 200,
                points: 20,
                category: 'visual-patterns'
            }
        ];
    }

    static generateNumberSequences() {
        return [
            {
                id: 'pattern_recognition_9',
                title: 'Simple Addition Sequence',
                difficulty: 'easy',
                question: 'What number comes next in this sequence: 2, 4, 6, 8, ?',
                type: 'multiple-choice',
                options: ['9', '10', '11', '12'],
                correctAnswer: 1,
                explanation: 'This sequence increases by 2 each time: 2 + 2 = 4, 4 + 2 = 6, 6 + 2 = 8, 8 + 2 = 10.',
                hints: [
                    'Look at the difference between consecutive numbers.',
                    'Each number is 2 more than the previous one.',
                    '2 → 4 → 6 → 8 → 10'
                ],
                timeLimit: 90,
                points: 10,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_10',
                title: 'Doubling Sequence',
                difficulty: 'easy',
                question: 'What number comes next: 1, 2, 4, 8, ?',
                type: 'multiple-choice',
                options: ['12', '14', '16', '18'],
                correctAnswer: 2,
                explanation: 'Each number is doubled: 1 × 2 = 2, 2 × 2 = 4, 4 × 2 = 8, 8 × 2 = 16.',
                hints: [
                    'Look at how each number relates to the previous one.',
                    'Each number is twice the previous number.',
                    '1 × 2 = 2, 2 × 2 = 4, 4 × 2 = 8, 8 × 2 = ?'
                ],
                timeLimit: 120,
                points: 10,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_11',
                title: 'Odd Number Sequence',
                difficulty: 'easy',
                question: 'What comes next in this sequence: 1, 3, 5, 7, ?',
                type: 'multiple-choice',
                options: ['8', '9', '10', '11'],
                correctAnswer: 1,
                explanation: 'This is the sequence of odd numbers, each increasing by 2: 7 + 2 = 9.',
                hints: [
                    'These are all odd numbers.',
                    'The difference between consecutive numbers is always 2.',
                    'Odd numbers: 1, 3, 5, 7, 9, 11...'
                ],
                timeLimit: 90,
                points: 10,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_12',
                title: 'Square Numbers',
                difficulty: 'medium',
                question: 'What number comes next: 1, 4, 9, 16, ?',
                type: 'multiple-choice',
                options: ['20', '24', '25', '30'],
                correctAnswer: 2,
                explanation: 'These are perfect squares: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25.',
                hints: [
                    'Try to see if these numbers are related to multiplication.',
                    'Each number is a perfect square: 1×1, 2×2, 3×3, 4×4...',
                    'The next number would be 5×5 = 25.'
                ],
                timeLimit: 150,
                points: 15,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_13',
                title: 'Fibonacci Start',
                difficulty: 'medium',
                question: 'What number comes next: 1, 1, 2, 3, 5, ?',
                type: 'multiple-choice',
                options: ['6', '7', '8', '9'],
                correctAnswer: 2,
                explanation: 'This is the Fibonacci sequence where each number is the sum of the two preceding ones: 3 + 5 = 8.',
                hints: [
                    'Look at how each number relates to the two before it.',
                    'Try adding the two previous numbers together.',
                    '1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = ?'
                ],
                timeLimit: 180,
                points: 15,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_14',
                title: 'Alternating Operations',
                difficulty: 'medium',
                question: 'What comes next: 2, 6, 5, 15, 14, ?',
                type: 'multiple-choice',
                options: ['40', '42', '44', '46'],
                correctAnswer: 1,
                explanation: 'The pattern alternates: multiply by 3, subtract 1. So 14 × 3 = 42.',
                hints: [
                    'Look at the operations between consecutive numbers.',
                    'Try: 2 × 3 = 6, 6 - 1 = 5, 5 × 3 = 15, 15 - 1 = 14...',
                    'The pattern alternates between multiplying by 3 and subtracting 1.'
                ],
                timeLimit: 200,
                points: 15,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_15',
                title: 'Prime Numbers',
                difficulty: 'hard',
                question: 'What prime number comes next: 2, 3, 5, 7, 11, ?',
                type: 'multiple-choice',
                options: ['12', '13', '14', '15'],
                correctAnswer: 1,
                explanation: 'These are consecutive prime numbers. After 11, the next prime number is 13.',
                hints: [
                    'These are all prime numbers (divisible only by 1 and themselves).',
                    'Find the next number that has no divisors other than 1 and itself.',
                    'Check: 12 = 2×6, 13 has no factors, 14 = 2×7, 15 = 3×5'
                ],
                timeLimit: 240,
                points: 20,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_16',
                title: 'Complex Pattern',
                difficulty: 'hard',
                question: 'What comes next: 1, 4, 13, 40, 121, ?',
                type: 'multiple-choice',
                options: ['364', '365', '366', '367'],
                correctAnswer: 0,
                explanation: 'Each term follows the pattern: 3 × previous term + 1. So 3 × 121 + 1 = 364.',
                hints: [
                    'Look for a mathematical relationship between consecutive terms.',
                    'Try multiplying each number by 3 and see what happens.',
                    '1×3+1=4, 4×3+1=13, 13×3+1=40, 40×3+1=121, 121×3+1=?'
                ],
                timeLimit: 300,
                points: 25,
                category: 'number-sequences'
            }
        ];
    }

    static generateShapePatterns() {
        return [
            {
                id: 'pattern_recognition_17',
                title: 'Shape Counting',
                difficulty: 'easy',
                question: 'If the pattern continues, how many hexagons will be in the 5th group: ⬡ ⬡⬡ ⬡⬡⬡ ⬡⬡⬡⬡ ?',
                type: 'multiple-choice',
                options: ['4', '5', '6', '7'],
                correctAnswer: 1,
                explanation: 'Each group has one more hexagon than its position number: Group 5 will have 5 hexagons.',
                hints: [
                    'Count the hexagons in each group: 1, 2, 3, 4...',
                    'The number of hexagons equals the group number.',
                    'Group 1: 1 hexagon, Group 2: 2 hexagons, Group 5: 5 hexagons'
                ],
                timeLimit: 120,
                points: 10,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_18',
                title: 'Shape Transformation',
                difficulty: 'medium',
                question: 'What shape comes next: Circle → Square → Triangle → Circle → Square → ?',
                type: 'multiple-choice',
                options: ['Circle', 'Square', 'Triangle', 'Pentagon'],
                correctAnswer: 2,
                explanation: 'The pattern repeats every 3 shapes: Circle, Square, Triangle, then repeats.',
                hints: [
                    'Look for a repeating cycle of shapes.',
                    'The pattern is: Circle → Square → Triangle → Circle → Square → ?',
                    'This is a 3-shape cycle that repeats.'
                ],
                timeLimit: 150,
                points: 15,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_19',
                title: 'Growing Shapes',
                difficulty: 'medium',
                question: 'In this pattern of dots forming shapes: • •• ••• •••• ?, how many dots in the next shape?',
                type: 'multiple-choice',
                options: ['4', '5', '6', '7'],
                correctAnswer: 1,
                explanation: 'Each shape adds one more dot: 1, 2, 3, 4, so the next has 5 dots.',
                hints: [
                    'Count the dots in each shape.',
                    'Each shape has one more dot than the previous.',
                    'The sequence is: 1, 2, 3, 4, 5...'
                ],
                timeLimit: 120,
                points: 15,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_20',
                title: 'Color and Shape',
                difficulty: 'medium',
                question: 'What comes next: Red Circle, Blue Square, Green Triangle, Red Circle, ?',
                type: 'multiple-choice',
                options: ['Blue Square', 'Green Triangle', 'Yellow Pentagon', 'Red Square'],
                correctAnswer: 0,
                explanation: 'The pattern repeats: Red Circle → Blue Square → Green Triangle → Red Circle → Blue Square.',
                hints: [
                    'Both color and shape follow a pattern.',
                    'Look for a repeating sequence of color-shape combinations.',
                    'The pattern repeats every 3 items.'
                ],
                timeLimit: 180,
                points: 15,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_21',
                title: 'Nested Shapes',
                difficulty: 'hard',
                question: 'Following this pattern of nested shapes: ○ ○□ ○□△ ?, what comes next?',
                type: 'multiple-choice',
                options: ['○□△◇', '○□△○', '□△◇', '○○□□'],
                correctAnswer: 0,
                explanation: 'Each step adds a new shape to the outside: Circle, Circle+Square, Circle+Square+Triangle, Circle+Square+Triangle+Diamond.',
                hints: [
                    'Notice how each step adds one more shape.',
                    'The shapes are added from inside to outside.',
                    'The sequence adds: Circle, then Square, then Triangle, then Diamond.'
                ],
                timeLimit: 240,
                points: 20,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_22',
                title: 'Shape Matrix',
                difficulty: 'hard',
                question: 'In a 3×3 grid where each row and column must contain exactly one Circle, Square, and Triangle, what shape goes in the bottom-right corner if the top row is Circle-Square-Triangle and the middle row is Square-Triangle-?',
                type: 'multiple-choice',
                options: ['Circle', 'Square', 'Triangle', 'Cannot be determined'],
                correctAnswer: 0,
                explanation: 'In the middle row, the missing shape must be Circle (to complete Circle-Square-Triangle). Then the bottom-right must be Circle to complete the third column pattern.',
                hints: [
                    'Each row and column must have exactly one of each shape.',
                    'First figure out what completes the middle row.',
                    'Then use the column constraint to find the bottom-right shape.'
                ],
                timeLimit: 300,
                points: 25,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_23',
                title: 'Symmetrical Patterns',
                difficulty: 'hard',
                question: 'What completes this symmetrical pattern: ▲○▲ ○□○ ▲○?',
                type: 'multiple-choice',
                options: ['○', '▲', '□', '◇'],
                correctAnswer: 1,
                explanation: 'The pattern is symmetrical around the center. To maintain symmetry, the missing piece should be ▲.',
                hints: [
                    'Look for symmetry in the pattern.',
                    'The pattern should be the same when read forwards and backwards.',
                    'Mirror the beginning of the pattern to find the end.'
                ],
                timeLimit: 240,
                points: 20,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_24',
                title: 'Fractal Pattern',
                difficulty: 'hard',
                question: 'In this fractal-like pattern where each step doubles the previous: ▲ ▲▲ ▲▲▲▲, how many triangles in the next step?',
                type: 'multiple-choice',
                options: ['6', '7', '8', '9'],
                correctAnswer: 2,
                explanation: 'The pattern doubles each time: 1 → 2 → 4 → 8 triangles.',
                hints: [
                    'Look at how the number of triangles changes each step.',
                    'Each step has twice as many triangles as the previous.',
                    '1 → 2 → 4 → 8 (doubling pattern)'
                ],
                timeLimit: 200,
                points: 25,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_25',
                title: 'Master Pattern Challenge',
                difficulty: 'hard',
                question: 'What completes this complex pattern: 1○ 2□□ 3△△△ 4?, where the number indicates how many of each shape appear?',
                type: 'multiple-choice',
                options: ['◇◇◇◇', '○○○○', '□□□□', '★★★★'],
                correctAnswer: 0,
                explanation: 'The pattern shows: 1 circle, 2 squares, 3 triangles, so 4 diamonds (or any new shape) would complete the pattern.',
                hints: [
                    'Look at both the numbers and the shapes.',
                    'The number tells you how many of each shape to use.',
                    'Pattern: 1 of shape 1, 2 of shape 2, 3 of shape 3, 4 of shape 4.'
                ],
                timeLimit: 300,
                points: 30,
                category: 'shape-patterns'
            }
        ];
    }
}

// Register the generator
if (typeof window !== 'undefined') {
    if (!window.PuzzleGenerators) {
        window.PuzzleGenerators = {};
    }
    window.PuzzleGenerators['pattern-recognition'] = PatternRecognitionGenerator;
}