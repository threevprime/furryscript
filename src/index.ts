import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";
import { Interpreter } from "./interpreter.ts";

export function runFurryScript(source: string): void {
    try {
        const lexer = new Lexer(source);
        const tokens = lexer.tokenize();
        const ast = Parser.parse(tokens);
        const interpreter = new Interpreter();
        interpreter.interpret(ast);
    } catch (error: any) {
        console.error('FurryScript Error:', error.message);
    }
}

export async function runFurryScriptFile(filePath: string): Promise<void> {
    try {
        const source = await Bun.file(filePath).text();
        runFurryScript(source);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.error(`File not found: ${filePath}`);
        } else {
            console.error('Error reading file:', error.message);
        }
    }
}

// CLI interface
if (import.meta.main) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        // REPL mode or default example
        console.log("FurryScript Interpreter");
        console.log("Usage: bun dev <file.fur>");
        console.log("\nRunning example code:");

        const sampleCode = `
      meow greeting = "Hello, FurryScript!"
      purr(greeting)
      purr("This is pawsome!")
    `;

        runFurryScript(sampleCode);
    } else if (args.length === 1) {
        // Run file
        const filePath = args[0];
        if (!filePath.endsWith('.fur')) {
            console.error('Error: FurryScript files must have a .fur extension');
            process.exit(1);
        }

        await runFurryScriptFile(filePath);
    } else {
        console.error('Error: Too many arguments. Usage: bun run main.ts <file.fur>');
        process.exit(1);
    }
}
