import {
    TokenType,
    type Token,
    type ASTNode,
    type Program,
    type StringLiteral,
    type IntegerLiteral,
    type FloatLiteral,
    type Identifier,
    type PrintStatement,
    type VariableDeclaration,
    type VariableAccess,
    type FunctionDeclaration,
    type FunctionCall,
    type UnaryExpression,
    type BinaryExpression,
    NodeType,
} from './types';

export class Parser {
    private tokens: Token[];
    private position: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private current(): Token {
        return this.tokens[this.position] || { type: TokenType.EOF, value: '', line: 0, column: 0 };
    }

    private peek(): Token {
        return this.tokens[this.position + 1] || { type: TokenType.EOF, value: '', line: 0, column: 0 };
    }

    private advance(): Token {
        const token = this.current();
        this.position++;
        return token;
    }

    private expect(tokenType: TokenType): Token {
        const token = this.current();
        if (token.type !== tokenType) {
            throw new Error(`Expected ${tokenType}, got ${token.type} at line ${token.line}`);
        }
        return this.advance();
    }

    private parse(): Program {
        const body: ASTNode[] = [];
        while (this.current().type !== TokenType.EOF) {
            body.push(this.parseStatement());
        }
        return { type: NodeType.Program, body };
    }

    private parseStatement(): ASTNode {
        switch (this.current().type) {
            case TokenType.PURR:
                return this.parsePrintStatement();
            case TokenType.MEOW:
                return this.parseVariableDeclaration();
            case TokenType.TRICK:
                return this.parseFunctionDeclaration();
            case TokenType.IDENTIFIER:
                if (this.peek().type === TokenType.LPAREN) {
                    return this.parseFunctionCall();
                }
                return this.parseVariableAccess();
            default:
                return this.parseExpression();
        }
    }

    private parsePrintStatement(): PrintStatement {
        this.expect(TokenType.PURR);
        this.expect(TokenType.LPAREN);
        const argument = this.parseExpression();
        this.expect(TokenType.RPAREN);
        return { type: NodeType.PrintStatement, argument };
    }

    private parseVariableDeclaration(): VariableDeclaration {
        this.expect(TokenType.MEOW);
        const name = this.expect(TokenType.IDENTIFIER).value;
        this.expect(TokenType.EQUALS);
        const value = this.parseExpression();
        return { type: NodeType.VariableDeclaration, name, value };
    }

    private parseVariableAccess(): VariableAccess {
        const name = this.expect(TokenType.IDENTIFIER).value;
        return { type: NodeType.VariableAccess, name: name };
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        this.expect(TokenType.TRICK);
        const name = this.expect(TokenType.IDENTIFIER).value;
        this.expect(TokenType.LPAREN);

        const parameters: Identifier[] = [];
        if (this.current().type !== TokenType.RPAREN) {
            do {
                parameters.push(this.parseIdentifier());
            } while (this.current().type === TokenType.IDENTIFIER && this.advance());
        }

        this.expect(TokenType.RPAREN);
        this.expect(TokenType.LBRACE);

        const body: ASTNode[] = [];
        while (this.current().type !== TokenType.RBRACE && this.current().type !== TokenType.EOF) {
            body.push(this.parseStatement());
        }

        this.expect(TokenType.RBRACE);
        return { type: NodeType.FunctionDeclaration, name, parameters, body };
    }

    private parseFunctionCall(): FunctionCall {
        const name = this.expect(TokenType.IDENTIFIER).value;
        this.expect(TokenType.LPAREN);

        const args: ASTNode[] = [];
        if (this.current().type !== TokenType.RPAREN) {
            do {
                args.push(this.parseExpression());
            } while (this.current().type === TokenType.IDENTIFIER && this.advance());
        }

        this.expect(TokenType.RPAREN);
        return { type: NodeType.FunctionCall, name, arguments: args };
    }

    private parseExpression(): ASTNode {
        return this.parseBinaryExpression();
    }

    private parsePrimaryExpression(): ASTNode {
        const token = this.current();

        if (token.type === TokenType.BINARY_OPERATOR && token.value === '-') {
            return this.parseUnaryExpression();
        }

        switch (token.type) {
            case TokenType.INTEGER:
                return this.parseIntegerLiteral();
            case TokenType.FLOAT:
                return this.parseFloatLiteral();
            case TokenType.STRING:
                return this.parseStringLiteral();
            case TokenType.IDENTIFIER:
                if (this.peek().type === TokenType.LPAREN) {
                    return this.parseFunctionCall();
                }
                return this.parseIdentifier();
            case TokenType.LPAREN: {
                this.advance(); // consume '('
                const expr = this.parseExpression();
                this.expect(TokenType.RPAREN);
                return expr;
            }
            default:
                throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
        }
    }

    private parseUnaryExpression(): UnaryExpression {
        const operator = this.advance().value;
        const argument = this.parsePrimaryExpression();
        return { type: NodeType.UnaryExpression, operator, argument };
    }

    private parseBinaryExpression(parentPrecedence = 0): ASTNode {
        let left = this.parsePrimaryExpression();

        while (true) {
            const operator = this.current().value;
            const precedence = this.getBinaryOperatorPrecedence(operator);

            if (precedence === 0 || precedence <= parentPrecedence) {
                break;
            }

            this.advance(); // consume operator
            const right = this.parseBinaryExpression(precedence);
            left = {
                type: NodeType.BinaryExpression,
                operator,
                left,
                right,
            } as BinaryExpression;
        }

        return left;
    }

    private getBinaryOperatorPrecedence(operator: string): number {
        switch (operator) {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
                return 2;
            default:
                return 0;
        }
    }

    private parseStringLiteral(): StringLiteral {
        const token = this.expect(TokenType.STRING);
        return { type: NodeType.StringLiteral, value: token.value };
    }

    private parseIntegerLiteral(): IntegerLiteral {
        const token = this.expect(TokenType.INTEGER);
        return { type: NodeType.IntegerLiteral, value: parseInt(token.value, 10) };
    }

    private parseFloatLiteral(): FloatLiteral {
        const token = this.expect(TokenType.FLOAT);
        return { type: NodeType.FloatLiteral, value: parseFloat(token.value) };
    }

    private parseIdentifier(): Identifier {
        const token = this.expect(TokenType.IDENTIFIER);
        return { type: NodeType.Identifier, name: token.value };
    }

    public static parse(tokens: Token[]): Program {
        const parser = new Parser(tokens);
        return parser.parse();
    }
}
