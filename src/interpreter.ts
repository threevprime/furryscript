import type { ASTNode, StringLiteral, Identifier, PrintStatement, VariableDeclaration, VariableAccess, Program } from "./types";

export class Interpreter {
    private variables: Map<string, any> = new Map();

    private evaluate(node: ASTNode): any {
        switch (node.type) {
            case 'StringLiteral':
                return (node as StringLiteral).value;

            case 'Identifier':
                const name = (node as Identifier).name;
                if (!this.variables.has(name)) {
                    throw new Error(`Undefined variable: ${name}`);
                }
                return this.variables.get(name);

            case 'VariableAccess':
                const varName = (node as VariableAccess).name;
                if (!this.variables.has(varName)) {
                    throw new Error(`Undefined variable: ${varName}`);
                }
                return this.variables.get(varName);

            default:
                throw new Error(`Cannot evaluate node type: ${node.type}`);
        }
    }

    private execute(node: ASTNode): void {
        switch (node.type) {
            case 'PrintStatement':
                const printStmt = node as PrintStatement;
                const value = this.evaluate(printStmt.argument);
                console.log(value);
                break;

            case 'VariableDeclaration':
                const varDecl = node as VariableDeclaration;
                const varValue = this.evaluate(varDecl.value);
                this.variables.set(varDecl.name, varValue);
                break;
            case 'VariableAccess':
                // Variable access as a statement doesn't do anything by itself
                this.evaluate(node);
                break;

            default:
                throw new Error(`Cannot execute node type: ${node.type}`);
        }
    }

    public interpret(ast: Program): void {
        for (const statement of ast.body) {
            this.execute(statement);
        }
    }
}
