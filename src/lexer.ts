import { TokenType, type Token } from "./types";

export class Lexer {
    private source: string;
    private position: number = 0;
    private line: number = 1;
    private column: number = 1;

    constructor(source: string) {
        this.source = source;
    }

    private advance(): string {
        if (this.position >= this.source.length) {
            return '\0';
        }

        const char = this.source[this.position];
        this.position++;

        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }

        return char;
    }

    private peek(): string {
        if (this.position >= this.source.length) {
            return '\0';
        }
        return this.source[this.position];
    }

    private skipWhitespace(): void {
        while (/\s/.test(this.peek())) {
            this.advance();
        }
    }

    private readString(): string {
        let value = '';
        this.advance(); // Skip opening quote

        while (this.peek() !== '"' && this.peek() !== '\0') {
            if (this.peek() === '\\') {
                this.advance(); // Skip backslash
                const escaped = this.advance();
                switch (escaped) {
                    case 'n': value += '\n'; break;
                    case 't': value += '\t'; break;
                    case 'r': value += '\r'; break;
                    case '\\': value += '\\'; break;
                    case '"': value += '"'; break;
                    default: value += escaped; break;
                }
            } else {
                value += this.advance();
            }
        }

        if (this.peek() === '"') {
            this.advance(); // Skip closing quote
        }

        return value;
    }

    private readNumber(): string {
        let value = '';
        while (/[0-9]/.test(this.peek())) {
            value += this.advance();
        }
        return value;
    }

    private readIdentifier(): string {
        let value = '';
        while (/[a-zA-Z_]/.test(this.peek())) {
            value += this.advance();
        }
        return value;
    }

    private isInteger(value: string): boolean {
        return /^-?[0-9]+$/.test(value);
    }

    public tokenize(): Token[] {
        const tokens: Token[] = [];

        while (this.position < this.source.length) {
            this.skipWhitespace();

            if (this.position >= this.source.length) break;

            const char = this.peek();
            const line = this.line;
            const column = this.column;

            if (char === '"') {
                const value = this.readString();
                tokens.push({ type: TokenType.STRING, value, line, column });
            } else if (char === '(') {
                this.advance();
                tokens.push({ type: TokenType.LPAREN, value: '(', line, column });
            } else if (char === ')') {
                this.advance();
                tokens.push({ type: TokenType.RPAREN, value: ')', line, column });
            } else if (char === '=') {
                this.advance();
                tokens.push({ type: TokenType.EQUALS, value: '=', line, column });
            } else if (char === '+' || char === '-' || char === '*' || char === '/') {
                this.advance();
                tokens.push({ type: TokenType.BINARY_OPERATOR, value: char, line, column });
            } else if (this.isInteger(char)) {
                const number = this.readNumber();
                tokens.push({ type: TokenType.INTEGER, value: number, line, column });
            } else if (/[a-zA-Z_]/.test(char)) {
                const identifier = this.readIdentifier();
                let tokenType: TokenType;

                switch (identifier) {
                    case 'purr': tokenType = TokenType.PURR; break;
                    case 'meow': tokenType = TokenType.MEOW; break;
                    case 'woof': tokenType = TokenType.WOOF; break;
                    default: tokenType = TokenType.IDENTIFIER; break;
                }

                tokens.push({ type: tokenType, value: identifier, line, column });
            } else {
                throw new Error(`Unexpected character '${char}' at line ${line}, column ${column}`);
            }
        }

        tokens.push({ type: TokenType.EOF, value: '', line: this.line, column: this.column });
        return tokens;
    }
}
