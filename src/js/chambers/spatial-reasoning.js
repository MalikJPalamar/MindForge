/**
 * Spatial Reasoning Chamber
 * Puzzles focused on 3D visualization, rotation, and spatial relationships
 */

class SpatialReasoningGenerator {
    static generatePuzzles() {
        const puzzles = [];

        // 2D Spatial Puzzles (1-8)
        puzzles.push(...this.generate2DSpatialPuzzles());

        // 3D Visualization Puzzles (9-16)
        puzzles.push(...this.generate3DVisualizationPuzzles());

        // Advanced Spatial Puzzles (17-25)
        puzzles.push(...this.generateAdvancedSpatialPuzzles());

        return puzzles;
    }

    static generate2DSpatialPuzzles() {
        return [
            {
                id: 'spatial_reasoning_1',
                title: 'Mirror Reflection',
                difficulty: 'easy',
                question: 'If you hold the letter "R" up to a mirror, what would you see?',
                type: 'multiple-choice',
                options: ['R', 'Я', 'ᴿ', 'ɿ'],
                correctAnswer: 1,
                explanation: 'When reflected in a mirror, the letter R appears reversed horizontally, looking like the Cyrillic letter Я.',
                hints: [
                    'Think about what happens when you look at text in a mirror.',
                    'Mirror reflections flip images horizontally.',
                    'The letter R would appear backwards when mirrored.'
                ],
                timeLimit: 120,
                points: 10,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_2',
                title: 'Shape Rotation',
                difficulty: 'easy',
                question: 'If you rotate the letter "L" 90 degrees clockwise, what shape does it resemble?',
                type: 'multiple-choice',
                options: ['Γ (gamma)', '⌐ (corner)', '└ (bottom-left corner)', '┘ (bottom-right corner)'],
                correctAnswer: 0,
                explanation: 'Rotating "L" 90 degrees clockwise transforms it into a shape resembling the Greek letter Γ (gamma).',
                hints: [
                    'Imagine the L turning to the right by 90 degrees.',
                    'The vertical line becomes horizontal, the horizontal line becomes vertical.',
                    'Think about which way the "corner" of the L would point after rotation.'
                ],
                timeLimit: 150,
                points: 10,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_3',
                title: 'Puzzle Piece Fitting',
                difficulty: 'easy',
                question: 'You have a puzzle piece shaped like ┐. Which opening would it fit into perfectly?',
                type: 'multiple-choice',
                options: ['┌ opening', '┐ opening', '└ opening', '┘ opening'],
                correctAnswer: 2,
                explanation: 'The piece ┐ fits into the └ opening because they are complementary shapes.',
                hints: [
                    'Think about which opening would complete a rectangle.',
                    'The piece and opening should fit together like puzzle pieces.',
                    'Look for the shape that complements the given piece.'
                ],
                timeLimit: 120,
                points: 10,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_4',
                title: 'Symmetry Recognition',
                difficulty: 'medium',
                question: 'Which of these shapes has both horizontal and vertical lines of symmetry?',
                type: 'multiple-choice',
                options: ['Triangle', 'Rectangle', 'Circle', 'Pentagon'],
                correctAnswer: 2,
                explanation: 'A circle has infinite lines of symmetry, including both horizontal and vertical lines through its center.',
                hints: [
                    'Think about folding the shape along different lines.',
                    'The shape should look identical when folded horizontally or vertically.',
                    'Consider which shape looks the same from all directions.'
                ],
                timeLimit: 180,
                points: 15,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_5',
                title: 'Path Navigation',
                difficulty: 'medium',
                question: 'Starting at point A, if you go 3 steps North, 2 steps East, 3 steps South, and 2 steps West, where do you end up?',
                type: 'multiple-choice',
                options: ['Back at point A', '2 steps North of A', '2 steps East of A', '4 steps from A'],
                correctAnswer: 0,
                explanation: 'The movements cancel out: North cancels South (3-3=0), East cancels West (2-2=0), returning to the starting point.',
                hints: [
                    'Track your position step by step.',
                    'Notice that some movements are in opposite directions.',
                    'North and South cancel each other, as do East and West.'
                ],
                timeLimit: 200,
                points: 15,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_6',
                title: 'Angle Visualization',
                difficulty: 'medium',
                question: 'If you start facing North and turn 270 degrees clockwise, which direction are you now facing?',
                type: 'multiple-choice',
                options: ['North', 'East', 'South', 'West'],
                correctAnswer: 3,
                explanation: '270 degrees clockwise from North: 90° = East, 180° = South, 270° = West.',
                hints: [
                    'Remember: 90° = quarter turn, 180° = half turn, 270° = three-quarter turn.',
                    'Clockwise from North: first East, then South, then West.',
                    '270 degrees is three-quarters of a full circle.'
                ],
                timeLimit: 180,
                points: 15,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_7',
                title: 'Overlapping Shapes',
                difficulty: 'medium',
                question: 'If a square overlaps with a circle, and both have the same center point, what is the maximum number of regions created?',
                type: 'multiple-choice',
                options: ['2 regions', '3 regions', '4 regions', '5 regions'],
                correctAnswer: 2,
                explanation: 'The overlapping creates 4 regions: inside circle only, inside square only, inside both, and outside both.',
                hints: [
                    'Think about the different areas created by the overlap.',
                    'Consider: inside the circle but not the square, inside the square but not the circle...',
                    'Don\'t forget the area that\'s inside both shapes and the area outside both.'
                ],
                timeLimit: 220,
                points: 15,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_8',
                title: 'Coordinate Transformation',
                difficulty: 'hard',
                question: 'Point (3, 2) is reflected across the line y = x. What are the new coordinates?',
                type: 'multiple-choice',
                options: ['(3, 2)', '(2, 3)', '(-3, -2)', '(-2, -3)'],
                correctAnswer: 1,
                explanation: 'Reflecting across y = x swaps the x and y coordinates: (3, 2) becomes (2, 3).',
                hints: [
                    'The line y = x is a diagonal line through the origin.',
                    'Reflection across y = x swaps x and y coordinates.',
                    'If the original point is (a, b), the reflected point is (b, a).'
                ],
                timeLimit: 240,
                points: 20,
                category: '2d-spatial'
            }
        ];
    }

    static generate3DVisualizationPuzzles() {
        return [
            {
                id: 'spatial_reasoning_9',
                title: 'Cube Unfolding',
                difficulty: 'medium',
                question: 'When you unfold a cube, how many faces will be visible in the flat pattern?',
                type: 'multiple-choice',
                options: ['4 faces', '5 faces', '6 faces', '8 faces'],
                correctAnswer: 2,
                explanation: 'A cube has 6 faces, and when unfolded into a flat pattern (net), all 6 faces are visible.',
                hints: [
                    'Think about how many sides a cube has.',
                    'When you unfold a box, you can see all its surfaces.',
                    'Count the faces of a dice or any cube-shaped object.'
                ],
                timeLimit: 150,
                points: 15,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_10',
                title: 'Box Folding',
                difficulty: 'medium',
                question: 'If you have a flat cross-shaped pattern with 6 squares, what 3D shape can you fold it into?',
                type: 'multiple-choice',
                options: ['Pyramid', 'Cube', 'Cylinder', 'Cone'],
                correctAnswer: 1,
                explanation: 'A cross-shaped pattern with 6 squares is a net of a cube, which can be folded into a cube.',
                hints: [
                    'Think about what shape has 6 equal square faces.',
                    'Imagine folding the cross pattern by bringing the edges together.',
                    'This is the reverse of unfolding a cube.'
                ],
                timeLimit: 180,
                points: 15,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_11',
                title: 'Shadow Projection',
                difficulty: 'medium',
                question: 'A sphere is placed between a light source and a wall. What shape will its shadow be?',
                type: 'multiple-choice',
                options: ['Circle', 'Oval', 'Square', 'Depends on the angle'],
                correctAnswer: 0,
                explanation: 'A sphere always casts a circular shadow regardless of the viewing angle, because it\'s perfectly round.',
                hints: [
                    'Think about the shape of a ball from any direction.',
                    'A sphere looks the same from all angles.',
                    'The shadow will match the outline you see when looking at the sphere.'
                ],
                timeLimit: 150,
                points: 15,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_12',
                title: 'Mental Rotation',
                difficulty: 'hard',
                question: 'Imagine a cube with a red dot on the top face. If you rotate it 90° forward (away from you), where is the red dot now?',
                type: 'multiple-choice',
                options: ['On the front face', 'On the back face', 'On the bottom face', 'Still on top'],
                correctAnswer: 1,
                explanation: 'When rotating 90° forward, the top face becomes the back face.',
                hints: [
                    'Imagine the cube tipping away from you.',
                    'The top surface moves to become the far side.',
                    'Think of the cube rolling forward one quarter turn.'
                ],
                timeLimit: 250,
                points: 20,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_13',
                title: 'Cross-Section Visualization',
                difficulty: 'hard',
                question: 'If you slice a cone horizontally (parallel to its base), what shape is the cross-section?',
                type: 'multiple-choice',
                options: ['Triangle', 'Circle', 'Oval', 'Rectangle'],
                correctAnswer: 1,
                explanation: 'A horizontal slice through a cone creates a circular cross-section, smaller than the base but still circular.',
                hints: [
                    'Think about cutting through a cone with a horizontal plane.',
                    'The cone has a circular base.',
                    'A horizontal cut maintains the circular shape but at a smaller size.'
                ],
                timeLimit: 220,
                points: 20,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_14',
                title: 'Volume Comparison',
                difficulty: 'hard',
                question: 'You have two containers: a tall thin cylinder and a short wide cylinder. Both have the same volume. If you pour water from the tall one to the short one, what happens to the water level?',
                type: 'multiple-choice',
                options: [
                    'Water level rises',
                    'Water level falls',
                    'Water level stays the same',
                    'Not enough information'
                ],
                correctAnswer: 1,
                explanation: 'Since the short cylinder is wider, the same volume of water will reach a lower height.',
                hints: [
                    'Both containers hold the same total amount.',
                    'Think about spreading the same amount over a wider area.',
                    'Wider base means lower height for the same volume.'
                ],
                timeLimit: 200,
                points: 20,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_15',
                title: 'Isometric Projection',
                difficulty: 'hard',
                question: 'Looking at a cube from a corner (so you can see 3 faces), how many edges are visible?',
                type: 'multiple-choice',
                options: ['6 edges', '7 edges', '8 edges', '9 edges'],
                correctAnswer: 3,
                explanation: 'From a corner view seeing 3 faces, you can see 9 edges: 3 edges around each visible face, with some edges shared.',
                hints: [
                    'You can see 3 faces of the cube.',
                    'Each face is a square with 4 edges.',
                    'Some edges are shared between faces - count carefully.'
                ],
                timeLimit: 300,
                points: 25,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_16',
                title: 'Complex Mental Rotation',
                difficulty: 'hard',
                question: 'A die shows 1 on top and 2 facing you. If you rotate it 90° clockwise (when viewed from above), what number now faces you?',
                type: 'multiple-choice',
                options: ['3', '4', '5', '6'],
                correctAnswer: 2,
                explanation: 'On a standard die, opposite faces sum to 7. With 1 on top (6 on bottom) and 2 facing you, rotating 90° clockwise brings 5 to face you.',
                hints: [
                    'Remember that opposite faces of a die add up to 7.',
                    'If 1 is on top, 6 is on the bottom.',
                    'With 2 facing you, think about what\'s to the right of 2.'
                ],
                timeLimit: 350,
                points: 25,
                category: '3d-visualization'
            }
        ];
    }

    static generateAdvancedSpatialPuzzles() {
        return [
            {
                id: 'spatial_reasoning_17',
                title: 'Impossible Object',
                difficulty: 'hard',
                question: 'A "Penrose triangle" appears to be a 3D triangle, but why is it impossible?',
                type: 'multiple-choice',
                options: [
                    'Triangles cannot be 3D',
                    'The angles don\'t add up correctly',
                    'It violates 3D spatial consistency',
                    'It\'s too complex to build'
                ],
                correctAnswer: 2,
                explanation: 'The Penrose triangle creates an optical illusion that violates 3D spatial consistency - it appears to connect in impossible ways.',
                hints: [
                    'This is about optical illusions and impossible geometry.',
                    'The triangle appears to loop back on itself impossibly.',
                    'In real 3D space, the connections shown cannot actually exist.'
                ],
                timeLimit: 250,
                points: 25,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_18',
                title: 'Topological Thinking',
                difficulty: 'hard',
                question: 'How many holes does a coffee mug have in topological terms?',
                type: 'multiple-choice',
                options: ['0 holes', '1 hole', '2 holes', '3 holes'],
                correctAnswer: 1,
                explanation: 'Topologically, a coffee mug has 1 hole (the handle creates a loop). The opening at the top is not a "hole through" the object.',
                hints: [
                    'In topology, we count holes that go completely through the object.',
                    'Think about the handle of the mug.',
                    'The opening at the top doesn\'t count as a topological hole.'
                ],
                timeLimit: 200,
                points: 25,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_19',
                title: 'Spatial Transformation Chain',
                difficulty: 'hard',
                question: 'Start with shape A. Rotate 180°, then reflect horizontally, then rotate 90° clockwise. This sequence is equivalent to what single transformation?',
                type: 'multiple-choice',
                options: [
                    'Rotate 90° counterclockwise',
                    'Rotate 90° clockwise',
                    'Reflect vertically',
                    'Rotate 270° clockwise'
                ],
                correctAnswer: 0,
                explanation: 'The sequence of transformations (180° rotation + horizontal reflection + 90° clockwise) equals a single 90° counterclockwise rotation.',
                hints: [
                    'Work through each transformation step by step.',
                    'Try to find a pattern or simplification.',
                    'Some combinations of transformations can be simplified to a single transformation.'
                ],
                timeLimit: 400,
                points: 30,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_20',
                title: 'Polyhedron Properties',
                difficulty: 'hard',
                question: 'A polyhedron has 12 faces, 20 vertices. Using Euler\'s formula (V - E + F = 2), how many edges does it have?',
                type: 'multiple-choice',
                options: ['28 edges', '30 edges', '32 edges', '34 edges'],
                correctAnswer: 1,
                explanation: 'Using Euler\'s formula: V - E + F = 2, so 20 - E + 12 = 2, therefore E = 30 edges.',
                hints: [
                    'Use Euler\'s formula: V - E + F = 2.',
                    'Substitute the known values: V = 20, F = 12.',
                    'Solve for E: 20 - E + 12 = 2.'
                ],
                timeLimit: 300,
                points: 25,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_21',
                title: 'Hypercube Visualization',
                difficulty: 'hard',
                question: 'A tesseract (4D hypercube) projected into 3D space appears to be what?',
                type: 'multiple-choice',
                options: [
                    'A cube inside another cube',
                    'A sphere',
                    'An octahedron',
                    'A pyramid'
                ],
                correctAnswer: 0,
                explanation: 'A tesseract projected into 3D space typically appears as a smaller cube inside a larger cube, connected at the vertices.',
                hints: [
                    'Think about how a 3D cube projects to 2D (as a square inside a square).',
                    'The 4D to 3D projection follows a similar pattern.',
                    'The projection shows nested geometric shapes.'
                ],
                timeLimit: 280,
                points: 30,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_22',
                title: 'Non-Euclidean Geometry',
                difficulty: 'hard',
                question: 'On the surface of a sphere, what is the sum of angles in a triangle?',
                type: 'multiple-choice',
                options: [
                    'Less than 180°',
                    'Exactly 180°',
                    'Greater than 180°',
                    'Always 360°'
                ],
                correctAnswer: 2,
                explanation: 'On a sphere\'s surface (spherical geometry), triangles have angle sums greater than 180° due to the curved space.',
                hints: [
                    'This is about curved space, not flat (Euclidean) geometry.',
                    'Think about a triangle drawn on Earth\'s surface.',
                    'Curvature affects angle measurements.'
                ],
                timeLimit: 250,
                points: 30,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_23',
                title: 'Fractal Dimension',
                difficulty: 'hard',
                question: 'The Koch snowflake has an infinite perimeter but finite area. What type of object is this?',
                type: 'multiple-choice',
                options: [
                    'A regular polygon',
                    'A fractal',
                    'A circle',
                    'An impossible object'
                ],
                correctAnswer: 1,
                explanation: 'The Koch snowflake is a fractal - a mathematical object with self-similar patterns at all scales and non-integer dimension.',
                hints: [
                    'This object has infinite detail at all scales.',
                    'It\'s created by a recursive process.',
                    'It has properties that seem paradoxical in normal geometry.'
                ],
                timeLimit: 200,
                points: 25,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_24',
                title: 'Multi-Dimensional Thinking',
                difficulty: 'hard',
                question: 'If you lived in a 2D world (Flatland) and a 3D sphere passed through your plane, what would you observe?',
                type: 'multiple-choice',
                options: [
                    'A constant circle',
                    'A growing then shrinking circle',
                    'A square',
                    'Nothing at all'
                ],
                correctAnswer: 1,
                explanation: 'A 3D sphere intersecting a 2D plane creates a circle that starts small, grows to maximum size, then shrinks back to nothing.',
                hints: [
                    'Think about cross-sections of a sphere.',
                    'Imagine the sphere moving through the 2D plane.',
                    'The intersection changes size as the sphere passes through.'
                ],
                timeLimit: 300,
                points: 30,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_25',
                title: 'Master Spatial Challenge',
                difficulty: 'hard',
                question: 'A Klein bottle is a surface with no distinct "inside" or "outside". In what minimum number of dimensions can it exist without self-intersection?',
                type: 'multiple-choice',
                options: [
                    '2 dimensions',
                    '3 dimensions',
                    '4 dimensions',
                    '5 dimensions'
                ],
                correctAnswer: 2,
                explanation: 'A Klein bottle requires 4 dimensions to exist without self-intersection, though it can be visualized (with self-intersection) in 3D.',
                hints: [
                    'This is about topological objects that seem impossible in our 3D world.',
                    'The Klein bottle needs extra dimensions to avoid intersecting itself.',
                    'Think about how complex topological shapes require higher dimensions.'
                ],
                timeLimit: 350,
                points: 35,
                category: 'advanced-spatial'
            }
        ];
    }
}

// Register the generator
if (typeof window !== 'undefined') {
    if (!window.PuzzleGenerators) {
        window.PuzzleGenerators = {};
    }
    window.PuzzleGenerators['spatial-reasoning'] = SpatialReasoningGenerator;
}