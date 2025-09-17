/**
 * Logical Sequences Chamber
 * Puzzles focused on logical progression and sequential reasoning
 */

class LogicalSequencesGenerator {
    static generatePuzzles() {
        const puzzles = [];

        // Basic Logic Sequences (1-8)
        puzzles.push(...this.generateBasicLogicSequences());

        // Conditional Sequences (9-16)
        puzzles.push(...this.generateConditionalSequences());

        // Advanced Logic Sequences (17-25)
        puzzles.push(...this.generateAdvancedSequences());

        return puzzles;
    }

    static generateBasicLogicSequences() {
        return [
            {
                id: 'logical_sequences_1',
                title: 'Basic If-Then Logic',
                difficulty: 'easy',
                question: 'If all roses are flowers, and this is a rose, then what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'This is a flower',
                    'This is not a flower',
                    'This might be a flower',
                    'We cannot conclude anything'
                ],
                correctAnswer: 0,
                explanation: 'Using logical deduction: All roses are flowers + This is a rose = This is a flower.',
                hints: [
                    'Use the rule "All roses are flowers" and apply it to "this is a rose".',
                    'In logic, if A is true for all B, and we have a B, then A is true.',
                    'If all roses are flowers, and we have a rose, it must be a flower.'
                ],
                timeLimit: 120,
                points: 10,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_2',
                title: 'Simple Negation',
                difficulty: 'easy',
                question: 'If "No cats are dogs" is true, and Fluffy is a cat, what can we conclude about Fluffy?',
                type: 'multiple-choice',
                options: [
                    'Fluffy is a dog',
                    'Fluffy is not a dog',
                    'Fluffy might be a dog',
                    'We need more information'
                ],
                correctAnswer: 1,
                explanation: 'Since no cats are dogs, and Fluffy is a cat, Fluffy cannot be a dog.',
                hints: [
                    'The statement says NO cats are dogs.',
                    'If Fluffy is a cat, and no cats are dogs...',
                    'This means Fluffy definitely cannot be a dog.'
                ],
                timeLimit: 90,
                points: 10,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_3',
                title: 'Transitive Logic',
                difficulty: 'easy',
                question: 'If A is larger than B, and B is larger than C, what is the relationship between A and C?',
                type: 'multiple-choice',
                options: [
                    'A is larger than C',
                    'A is smaller than C',
                    'A is equal to C',
                    'Cannot be determined'
                ],
                correctAnswer: 0,
                explanation: 'This is transitive reasoning: if A > B and B > C, then A > C.',
                hints: [
                    'Think about ordering: if A > B and B > C...',
                    'This is like saying: if John is taller than Mary, and Mary is taller than Sam...',
                    'Use the transitive property: A > B > C means A > C.'
                ],
                timeLimit: 120,
                points: 10,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_4',
                title: 'Logical Implication',
                difficulty: 'medium',
                question: 'If "It\'s raining, then the ground is wet" and "The ground is not wet", what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'It is raining',
                    'It is not raining',
                    'It might be raining',
                    'We cannot tell'
                ],
                correctAnswer: 1,
                explanation: 'This uses modus tollens: If P→Q and not Q, then not P. Since the ground is not wet, it cannot be raining.',
                hints: [
                    'We know: IF raining THEN ground wet.',
                    'We observe: ground is NOT wet.',
                    'If raining always makes ground wet, but ground is not wet, then it cannot be raining.'
                ],
                timeLimit: 180,
                points: 15,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_5',
                title: 'Set Logic',
                difficulty: 'medium',
                question: 'If all students in the math club are also in the science club, and Sarah is in the math club, where else must Sarah be?',
                type: 'multiple-choice',
                options: [
                    'Art club',
                    'Science club',
                    'History club',
                    'Drama club'
                ],
                correctAnswer: 1,
                explanation: 'Since all math club students are also in science club, and Sarah is in math club, she must also be in science club.',
                hints: [
                    'The rule states ALL math club members are ALSO in science club.',
                    'Sarah is in the math club.',
                    'Therefore, Sarah must follow the rule for all math club members.'
                ],
                timeLimit: 150,
                points: 15,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_6',
                title: 'Logical Contradiction',
                difficulty: 'medium',
                question: 'Given: "All birds can fly" and "Penguins are birds" and "Penguins cannot fly". What is wrong?',
                type: 'multiple-choice',
                options: [
                    'Nothing is wrong',
                    'The statements contradict each other',
                    'We need more information',
                    'All statements are false'
                ],
                correctAnswer: 1,
                explanation: 'These statements create a logical contradiction. If all birds can fly, but penguins are birds that cannot fly, the statements are inconsistent.',
                hints: [
                    'Try to follow the logic: All birds fly → Penguins are birds → Penguins fly.',
                    'But we also know penguins cannot fly.',
                    'When logic leads to opposite conclusions, there\'s a contradiction.'
                ],
                timeLimit: 200,
                points: 15,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_7',
                title: 'Disjunctive Logic',
                difficulty: 'medium',
                question: 'If "Either it will rain or it will snow" and "It will not rain", what must happen?',
                type: 'multiple-choice',
                options: [
                    'It will not snow',
                    'It will snow',
                    'It might snow',
                    'Nothing will happen'
                ],
                correctAnswer: 1,
                explanation: 'In an "either A or B" statement, if A is false, then B must be true. Since it won\'t rain, it must snow.',
                hints: [
                    'We have "Either rain OR snow" - one of these must happen.',
                    'We know it will NOT rain.',
                    'If rain is ruled out, what\'s left from "rain or snow"?'
                ],
                timeLimit: 150,
                points: 15,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_8',
                title: 'Contrapositive Logic',
                difficulty: 'hard',
                question: 'If "All good students study hard" is true, which statement must also be true?',
                type: 'multiple-choice',
                options: [
                    'All hard-studying students are good',
                    'If someone doesn\'t study hard, they are not a good student',
                    'Some good students don\'t study hard',
                    'Hard studying makes students good'
                ],
                correctAnswer: 1,
                explanation: 'The contrapositive of "All good students study hard" is "If someone doesn\'t study hard, they cannot be a good student".',
                hints: [
                    'Look for the contrapositive: If A → B, then not B → not A.',
                    'Original: Good student → Studies hard.',
                    'Contrapositive: Doesn\'t study hard → Not a good student.'
                ],
                timeLimit: 240,
                points: 20,
                category: 'basic-logic'
            }
        ];
    }

    static generateConditionalSequences() {
        return [
            {
                id: 'logical_sequences_9',
                title: 'Multiple Conditions',
                difficulty: 'medium',
                question: 'If "To pass the exam, you must study AND get enough sleep", and John studied but didn\'t sleep enough, what happens?',
                type: 'multiple-choice',
                options: [
                    'John passes the exam',
                    'John fails the exam',
                    'John might pass the exam',
                    'We need more information'
                ],
                correctAnswer: 1,
                explanation: 'Both conditions (study AND sleep) are required. Since John didn\'t meet both conditions, he fails.',
                hints: [
                    'The rule requires BOTH studying AND sleeping enough.',
                    'John only met one condition (studying).',
                    'When ALL conditions are required, missing any one means failure.'
                ],
                timeLimit: 180,
                points: 15,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_10',
                title: 'Alternative Conditions',
                difficulty: 'medium',
                question: 'If "You can enter if you have a ticket OR if you are on the guest list", and Maria has no ticket but is on the guest list, can she enter?',
                type: 'multiple-choice',
                options: [
                    'Yes, she can enter',
                    'No, she cannot enter',
                    'Only if she gets a ticket',
                    'It depends on other factors'
                ],
                correctAnswer: 0,
                explanation: 'The condition uses OR, meaning either condition is sufficient. Since Maria is on the guest list, she can enter.',
                hints: [
                    'The rule says ticket OR guest list - either one works.',
                    'Maria doesn\'t have a ticket, but is on the guest list.',
                    'Since she meets one of the OR conditions, she qualifies.'
                ],
                timeLimit: 150,
                points: 15,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_11',
                title: 'Nested Conditions',
                difficulty: 'hard',
                question: 'If "If it rains, then if you go out, you will get wet", and it\'s raining and you go out, what happens?',
                type: 'multiple-choice',
                options: [
                    'You will get wet',
                    'You will not get wet',
                    'You might get wet',
                    'Cannot be determined'
                ],
                correctAnswer: 0,
                explanation: 'The nested condition states: Rain → (Go out → Get wet). Since both conditions are met (raining AND going out), you get wet.',
                hints: [
                    'Break down the nested condition: IF raining, THEN (IF go out, THEN get wet).',
                    'It is raining, so the inner condition applies: IF go out, THEN get wet.',
                    'You do go out, so you get wet.'
                ],
                timeLimit: 240,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_12',
                title: 'Complex Conditional Chain',
                difficulty: 'hard',
                question: 'Given: "If A then B", "If B then C", "If C then D". If A is true, what can we conclude about D?',
                type: 'multiple-choice',
                options: [
                    'D is true',
                    'D is false',
                    'D might be true',
                    'Cannot determine D'
                ],
                correctAnswer: 0,
                explanation: 'Following the chain: A → B → C → D. If A is true, then B is true, then C is true, then D is true.',
                hints: [
                    'Follow the chain step by step.',
                    'A is true, so B must be true (from A → B).',
                    'If B is true, then C is true, then D is true.'
                ],
                timeLimit: 200,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_13',
                title: 'Conditional with Negation',
                difficulty: 'hard',
                question: 'If "If you don\'t study, then you won\'t pass", and Emma passed the test, what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'Emma studied',
                    'Emma didn\'t study',
                    'Emma might have studied',
                    'We cannot conclude anything about studying'
                ],
                correctAnswer: 0,
                explanation: 'Using contrapositive: "If you don\'t study → you won\'t pass" becomes "If you pass → you studied". Since Emma passed, she studied.',
                hints: [
                    'The original statement: Don\'t study → Don\'t pass.',
                    'The contrapositive: Pass → Study.',
                    'Emma passed, so by contrapositive, she must have studied.'
                ],
                timeLimit: 250,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_14',
                title: 'Biconditional Logic',
                difficulty: 'hard',
                question: 'If "You get a discount if and only if you are a member", and Tom got a discount, what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'Tom is a member',
                    'Tom might be a member',
                    'Tom is not a member',
                    'We need more information'
                ],
                correctAnswer: 0,
                explanation: '"If and only if" means the conditions work both ways. Getting a discount guarantees membership, and membership guarantees discount.',
                hints: [
                    '"If and only if" means both directions: Member → Discount AND Discount → Member.',
                    'Tom got a discount.',
                    'Since Discount → Member, Tom must be a member.'
                ],
                timeLimit: 220,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_15',
                title: 'Exclusive Or Logic',
                difficulty: 'hard',
                question: 'If "You can have either cake or ice cream, but not both", and you choose cake, what about ice cream?',
                type: 'multiple-choice',
                options: [
                    'You can also have ice cream',
                    'You cannot have ice cream',
                    'You might have ice cream',
                    'Ice cream is required'
                ],
                correctAnswer: 1,
                explanation: 'This is exclusive OR - you can have one or the other, but not both. Choosing cake excludes ice cream.',
                hints: [
                    'The key phrase is "but not both" - this makes it exclusive.',
                    'You can have cake OR ice cream, but NOT both.',
                    'Since you chose cake, you cannot also have ice cream.'
                ],
                timeLimit: 180,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_16',
                title: 'Complex Multi-Conditional',
                difficulty: 'hard',
                question: 'Rules: "If sunny, go to beach. If rainy, stay home. If cloudy, go to mall." It\'s sunny and you\'re at the mall. What\'s wrong?',
                type: 'multiple-choice',
                options: [
                    'Nothing is wrong',
                    'You should be at the beach',
                    'You should be at home',
                    'The weather is impossible'
                ],
                correctAnswer: 1,
                explanation: 'Since it\'s sunny, the rule "If sunny, go to beach" applies. Being at the mall contradicts this rule.',
                hints: [
                    'Check what the rule says for sunny weather.',
                    'The rule for sunny weather is "go to beach".',
                    'You\'re at the mall instead of following the sunny weather rule.'
                ],
                timeLimit: 200,
                points: 25,
                category: 'conditional-logic'
            }
        ];
    }

    static generateAdvancedSequences() {
        return [
            {
                id: 'logical_sequences_17',
                title: 'Syllogistic Reasoning',
                difficulty: 'hard',
                question: 'All philosophers are thinkers. Some thinkers are scientists. Therefore, what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'All philosophers are scientists',
                    'Some philosophers are scientists',
                    'No philosophers are scientists',
                    'We cannot conclude anything definitive'
                ],
                correctAnswer: 3,
                explanation: 'This is an invalid syllogism. We cannot conclude anything definitive about the relationship between philosophers and scientists.',
                hints: [
                    'Be careful with syllogisms - not all lead to valid conclusions.',
                    'All philosophers are thinkers, but only SOME thinkers are scientists.',
                    'We don\'t know if the philosopher-thinkers overlap with the scientist-thinkers.'
                ],
                timeLimit: 300,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_18',
                title: 'Quantified Logic',
                difficulty: 'hard',
                question: 'If "Some cats are black" and "All black things absorb heat", what can we conclude about cats and heat absorption?',
                type: 'multiple-choice',
                options: [
                    'All cats absorb heat',
                    'Some cats absorb heat',
                    'No cats absorb heat',
                    'Only black cats absorb heat'
                ],
                correctAnswer: 1,
                explanation: 'Some cats are black, and all black things absorb heat, so some cats (the black ones) absorb heat.',
                hints: [
                    'Focus on the black cats specifically.',
                    'Some cats are black, and ALL black things absorb heat.',
                    'Therefore, those cats that are black must absorb heat.'
                ],
                timeLimit: 250,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_19',
                title: 'Modal Logic',
                difficulty: 'hard',
                question: 'If "It is necessary that all students attend class" and "John is a student", what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'John might attend class',
                    'John will probably attend class',
                    'John must attend class',
                    'John chooses whether to attend'
                ],
                correctAnswer: 2,
                explanation: 'Modal logic: "Necessary" means it must be true. Since all students must attend and John is a student, John must attend.',
                hints: [
                    '"Necessary" in logic means "must be true".',
                    'If it\'s necessary that ALL students attend, and John is a student...',
                    'Then it\'s necessary (must be true) that John attends.'
                ],
                timeLimit: 220,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_20',
                title: 'Predicate Logic',
                difficulty: 'hard',
                question: 'Given: "For all x, if x is a dog, then x is an animal" and "Buddy is a dog", what follows?',
                type: 'multiple-choice',
                options: [
                    'Buddy might be an animal',
                    'Buddy is an animal',
                    'Buddy is not an animal',
                    'We need to know more about Buddy'
                ],
                correctAnswer: 1,
                explanation: 'Universal instantiation: The rule applies to ALL x, so it applies to Buddy. Since Buddy is a dog, Buddy is an animal.',
                hints: [
                    'The rule applies to ALL x (everything).',
                    'Buddy is one specific case of x.',
                    'Apply the rule: IF Buddy is a dog, THEN Buddy is an animal.'
                ],
                timeLimit: 200,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_21',
                title: 'Proof by Contradiction',
                difficulty: 'hard',
                question: 'To prove "All swans are white", you assume "There exists a non-white swan" and derive a contradiction. What does this prove?',
                type: 'multiple-choice',
                options: [
                    'All swans are white',
                    'No swans are white',
                    'Some swans are white',
                    'The assumption was correct'
                ],
                correctAnswer: 0,
                explanation: 'Proof by contradiction: If assuming the opposite leads to a contradiction, the original statement must be true.',
                hints: [
                    'In proof by contradiction, you assume the opposite of what you want to prove.',
                    'If this assumption leads to a contradiction, the assumption must be false.',
                    'If "there exists a non-white swan" is false, then all swans are white.'
                ],
                timeLimit: 280,
                points: 30,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_22',
                title: 'Set Theory Logic',
                difficulty: 'hard',
                question: 'If set A ⊆ B (A is subset of B) and B ⊆ C, and x ∈ A, what can we conclude about x and C?',
                type: 'multiple-choice',
                options: [
                    'x ∈ C',
                    'x ∉ C',
                    'x might be in C',
                    'Cannot determine'
                ],
                correctAnswer: 0,
                explanation: 'Subset transitivity: If A ⊆ B and B ⊆ C, then A ⊆ C. Since x ∈ A and A ⊆ C, then x ∈ C.',
                hints: [
                    'If A is a subset of B, all elements of A are in B.',
                    'If B is a subset of C, all elements of B are in C.',
                    'Therefore, all elements of A are also in C.'
                ],
                timeLimit: 240,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_23',
                title: 'Logical Equivalence',
                difficulty: 'hard',
                question: 'Which statement is logically equivalent to "If it rains, then the picnic is cancelled"?',
                type: 'multiple-choice',
                options: [
                    'If the picnic is not cancelled, then it\'s not raining',
                    'If it doesn\'t rain, then the picnic is not cancelled',
                    'The picnic is cancelled if and only if it rains',
                    'It rains if and only if the picnic is cancelled'
                ],
                correctAnswer: 0,
                explanation: 'The contrapositive "If not Q then not P" is logically equivalent to "If P then Q".',
                hints: [
                    'Look for the contrapositive form.',
                    'Original: Rain → Cancel picnic.',
                    'Contrapositive: Not cancel → Not rain.'
                ],
                timeLimit: 250,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_24',
                title: 'Paradox Resolution',
                difficulty: 'hard',
                question: 'Consider: "This statement is false." If the statement is true, then it\'s false. If it\'s false, then it\'s true. What is this?',
                type: 'multiple-choice',
                options: [
                    'A true statement',
                    'A false statement',
                    'A logical paradox',
                    'A meaningless statement'
                ],
                correctAnswer: 2,
                explanation: 'This is the Liar Paradox, a famous logical paradox that creates a self-referential contradiction.',
                hints: [
                    'This is a famous problem in logic.',
                    'The statement refers to itself, creating a loop.',
                    'When a statement leads to contradictory conclusions, it\'s a paradox.'
                ],
                timeLimit: 300,
                points: 30,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_25',
                title: 'Meta-Logical Reasoning',
                difficulty: 'hard',
                question: 'In a logical system, if we can prove both "P" and "not P", what does this indicate about the system?',
                type: 'multiple-choice',
                options: [
                    'The system is complete',
                    'The system is consistent',
                    'The system is inconsistent',
                    'The system is undecidable'
                ],
                correctAnswer: 2,
                explanation: 'A logical system that can prove both a statement and its negation is inconsistent, as this violates the principle of non-contradiction.',
                hints: [
                    'In logic, a statement cannot be both true and false.',
                    'If a system proves both P and not-P, it contradicts this principle.',
                    'When a system allows contradictions, it\'s called inconsistent.'
                ],
                timeLimit: 350,
                points: 35,
                category: 'advanced-logic'
            }
        ];
    }
}

// Register the generator
if (typeof window !== 'undefined') {
    if (!window.PuzzleGenerators) {
        window.PuzzleGenerators = {};
    }
    window.PuzzleGenerators['logical-sequences'] = LogicalSequencesGenerator;
}