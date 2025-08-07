import { TokenType, type StringLiteral, type Token, type Identifier, type PrintStatement, type VariableDeclaration, type VariableAccess, type Program, type ASTNode, type IntegerLiteral } from "./types";

export class Parser {
    private tokens: Token[];
    private position: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private current(): Token {
        return this.tokens[this.position] || { type: TokenType.EOF, value: '', line: 0, column: 0 };
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

    private parseStringLiteral(): StringLiteral {
        const token = this.expect(TokenType.STRING);
        return {
            type: 'StringLiteral',
            value: token.value
        };
    }

    private parseIntegerLiteral(): IntegerLiteral {
        const token = this.expect(TokenType.INTEGER);
        return {
            type: 'IntegerLiteral',
            value: parseInt(token.value, 10)
        };
    }

    private parseIdentifier(): Identifier {
        const token = this.expect(TokenType.IDENTIFIER);
        return {
            type: 'Identifier',
            name: token.value
        };
    }

    private parsePrintStatement(): PrintStatement {
        this.expect(TokenType.PURR);
        this.expect(TokenType.LPAREN);

        const argument = this.current().type === TokenType.STRING
            ? this.parseStringLiteral()
            : this.parseIdentifier();

        this.expect(TokenType.RPAREN);

        return {
            type: 'PrintStatement',
            argument
        };
    }

    private parseVariableDeclaration(): VariableDeclaration {
        this.expect(TokenType.MEOW);
        const nameToken = this.expect(TokenType.IDENTIFIER);
        this.expect(TokenType.EQUALS);

        let value;

        if (this.current().type === TokenType.INTEGER) {
            value = this.parseIntegerLiteral();
        } else if (this.current().type === TokenType.FLOAT) {
            value = this.parseStringLiteral();
        } else {
            value = this.parseStringLiteral();
        }


        return {
            type: 'VariableDeclaration',
            name: nameToken.value,
            value
        };
    }

    private parseVariableAccess(): VariableAccess {
        this.expect(TokenType.WOOF);
        const nameToken = this.expect(TokenType.IDENTIFIER);

        return {
            type: 'VariableAccess',
            name: nameToken.value
        };
    }

    private parseStatement(): ASTNode {
        const token = this.current();

        switch (token.type) {
            case TokenType.PURR:
                return this.parsePrintStatement();
            case TokenType.MEOW:
                return this.parseVariableDeclaration();
            case TokenType.WOOF:
                return this.parseVariableAccess();
            default:
                throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
        }
    }

    public parse(): Program {
        const body: ASTNode[] = [];

        while (this.current().type !== TokenType.EOF) {
            body.push(this.parseStatement());
        }

        return {
            type: 'Program',
            body
        };
    }
}
