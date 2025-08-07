import {
    type ASTNode,
    type Program,
    type StringLiteral,
    type IntegerLiteral,
    type FloatLiteral,
    type Identifier,
    type PrintStatement,
    type VariableDeclaration,
    type VariableAccess,
    type UnaryExpression,
    type BinaryExpression,
    NodeType,
} from './types';

export class Interpreter {
    private variables: Map<string, any> = new Map();

    public interpret(ast: Program): void {
        for (const statement of ast.body) {
            this.execute(statement);
        }
    }

    private execute(node: ASTNode): void {
        switch (node.type) {
            case NodeType.PrintStatement:
                this.executePrintStatement(node as PrintStatement);
                break;
            case NodeType.VariableDeclaration:
                this.executeVariableDeclaration(node as VariableDeclaration);
                break;
            case NodeType.VariableAccess:
                this.evaluate(node); // Evaluate and discard result
                break;
            default:
                // If it's not a statement, it might be an expression to evaluate
                this.evaluate(node);
        }
    }

    private executePrintStatement(node: PrintStatement): void {
        const value = this.evaluate(node.argument);
        console.log(value);
    }

    private executeVariableDeclaration(node: VariableDeclaration): void {
        const value = this.evaluate(node.value);
        this.variables.set(node.name, value);
    }

    private evaluate(node: ASTNode): any {
        switch (node.type) {
            case NodeType.StringLiteral:
                return (node as StringLiteral).value;
            case NodeType.IntegerLiteral:
                return (node as IntegerLiteral).value;
            case NodeType.FloatLiteral:
                return (node as FloatLiteral).value;
            case NodeType.Identifier:
                return this.evaluateIdentifier(node as Identifier);
            case NodeType.VariableAccess:
                return this.evaluateVariableAccess(node as VariableAccess);
            case NodeType.UnaryExpression:
                return this.evaluateUnaryExpression(node as UnaryExpression);
            case NodeType.BinaryExpression:
                return this.evaluateBinaryExpression(node as BinaryExpression);
            default:
                throw new Error(`Cannot evaluate node type: ${node.type}`);
        }
    }

    private evaluateIdentifier(node: Identifier): any {
        if (!this.variables.has(node.name)) {
            throw new Error(`Undefined variable: ${node.name}`);
        }
        return this.variables.get(node.name);
    }

    private evaluateVariableAccess(node: VariableAccess): any {
        if (!this.variables.has(node.name)) {
            throw new Error(`Undefined variable: ${node.name}`);
        }
        return this.variables.get(node.name);
    }

    private evaluateUnaryExpression(node: UnaryExpression): any {
        const argument = this.evaluate(node.argument);
        switch (node.operator) {
            case '-':
                return -argument;
            default:
                throw new Error(`Unsupported unary operator: ${node.operator}`);
        }
    }

    private evaluateBinaryExpression(node: BinaryExpression): any {
        const left = this.evaluate(node.left);
        const right = this.evaluate(node.right);

        switch (node.operator) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            default:
                throw new Error(`Unsupported binary operator: ${node.operator}`);
        }
    }
}
