# FurryScript

FurryScript is a simple, dynamic programming language built for learning and experimentation. It's written in TypeScript and runs on Bun.

## Features

*   **Variable Declaration**: Create variables for strings, integers, and floats.
*   **Arithmetic**: Perform basic calculations (`+`, `-`, `*`, `/`).
*   **Console Output**: Print values to the console.
*   **Functions**: Define and call your own custom functions, with support for parameters and return values (`wag`).

## Installation

To install dependencies:

```bash
bun install
```

## Usage

To run a FurryScript file:

```bash
bun dev <file.fur>
```

For example:

```bash
bun dev examples/hello.fur
```

## Syntax Examples

### Variables and Printing

```javascript
// Declare a variable
meow greeting = "Hello, FurryScript!"

// Print the variable
purr(greeting)

// Print a literal string
purr("This is pawsome!")
```

### Functions

```javascript
// Define a function that doesn't return a value
trick greet(name) {
  purr("Hello, " + name)
}

// Define a function that returns a value
trick add(a, b) {
  wag a + b
}

// Call the functions
greet("FurryScript")

meow sum = add(5, 10)
purr("5 + 10 = " + sum)
```

## How It Works

The interpreter processes FurryScript code in three main stages:

1.  **Lexer (Tokenizer)**: The lexer reads the source code as a string and breaks it down into a sequence of tokens. Each token represents a small, meaningful unit, like a keyword (`meow`), an identifier (`greeting`), an operator (`=`), or a literal value (`"Hello, FurryScript!"`). This process is handled by `src/lexer.ts`.

2.  **Parser**: The parser takes the flat list of tokens from the lexer and organizes them into a hierarchical structure called an Abstract Syntax Tree (AST). The AST represents the code's grammatical structure, making it easier for the interpreter to understand. For example, a variable declaration becomes a `VariableDeclaration` node in the tree. This is managed by `src/parser.ts`.

3.  **Interpreter**: The interpreter "walks" the AST, visiting each node and executing the corresponding logic. It manages a symbol table to store variables and their values, handles function calls, and evaluates expressions. This final stage, located in `src/interpreter.ts`, is what actually runs the program.
