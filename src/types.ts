export enum TokenType {
    // Literals
    STRING = 'STRING',
    INTEGER = 'INTEGER',
    FLOAT = 'FLOAT',
    IDENTIFIER = 'IDENTIFIER',

    // Keywords
    TRICK = 'TRICK', // function declaration
    PURR = 'PURR', // print function
    MEOW = 'MEOW', // variable declaration
    WOOF = 'WOOF', // variable access

    // Operators/Punctuation
    EQUALS = 'EQUALS',
    LPAREN = 'LPAREN',
    RPAREN = 'RPAREN',
    LBRACKET = 'LBRACKET',
    RBRACKET = 'RBRACKET',
    LBRACE = 'LBRACE',
    RBRACE = 'RBRACE',
    BINARY_OPERATOR = 'BINARY_OPERATOR',

    // Special
    EOF = 'EOF',
}

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}

// AST Node types
export enum NodeType {
    Program = 'Program',
    StringLiteral = 'StringLiteral',
    IntegerLiteral = 'IntegerLiteral',
    FloatLiteral = 'FloatLiteral',
    Identifier = 'Identifier',
    PrintStatement = 'PrintStatement',
    VariableDeclaration = 'VariableDeclaration',
    VariableAccess = 'VariableAccess',
    FunctionDeclaration = 'FunctionDeclaration',
    FunctionCall = 'FunctionCall',
    BinaryExpression = 'BinaryExpression',
    UnaryExpression = 'UnaryExpression',
}

export interface ASTNode {
    type: NodeType;
}

export interface Program extends ASTNode {
    type: NodeType.Program;
    body: ASTNode[];
}

export interface StringLiteral extends ASTNode {
    type: NodeType.StringLiteral;
    value: string;
}

export interface IntegerLiteral extends ASTNode {
    type: NodeType.IntegerLiteral;
    value: number;
}

export interface FloatLiteral extends ASTNode {
    type: NodeType.FloatLiteral;
    value: number;
}

export interface Identifier extends ASTNode {
    type: NodeType.Identifier;
    name: string;
}

export interface PrintStatement extends ASTNode {
    type: NodeType.PrintStatement;
    argument: ASTNode;
}

export interface VariableDeclaration extends ASTNode {
    type: NodeType.VariableDeclaration;
    name: string;
    value: ASTNode;
}

export interface VariableAccess extends ASTNode {
    type: NodeType.VariableAccess;
    name: string;
}

export interface FunctionDeclaration extends ASTNode {
    type: NodeType.FunctionDeclaration;
    name: string;
    parameters: Identifier[];
    body: ASTNode[];
}

export interface FunctionCall extends ASTNode {
    type: NodeType.FunctionCall;
    name: string;
    arguments: ASTNode[];
}

export interface BinaryExpression extends ASTNode {
    type: NodeType.BinaryExpression;
    operator: string;
    left: ASTNode;
    right: ASTNode;
}

export interface UnaryExpression extends ASTNode {
    type: NodeType.UnaryExpression;
    operator: string;
    argument: ASTNode;
}
