export enum TokenType {
    // Literals
    STRING = 'STRING',
    INTEGER = 'INTEGER',
    IDENTIFIER = 'IDENTIFIER',

    // Keywords  
    PURR = 'PURR',      // print function
    MEOW = 'MEOW',      // variable declaration
    WOOF = 'WOOF',      // variable access

    // Operators/Punctuation
    EQUALS = 'EQUALS',
    LPAREN = 'LPAREN',
    RPAREN = 'RPAREN',
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
export interface ASTNode {
    type: string;
}

export interface StringLiteral extends ASTNode {
    type: 'StringLiteral';
    value: string;
}

export interface Identifier extends ASTNode {
    type: 'Identifier';
    name: string;
}

export interface PrintStatement extends ASTNode {
    type: 'PrintStatement';
    argument: ASTNode;
}

export interface VariableDeclaration extends ASTNode {
    type: 'VariableDeclaration';
    name: string;
    value: ASTNode;
}

export interface VariableAccess extends ASTNode {
    type: 'VariableAccess';
    name: string;
}

export interface Program extends ASTNode {
    type: 'Program';
    body: ASTNode[];
}
