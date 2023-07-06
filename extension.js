const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('remove-whitespace', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        let text = editor.document.getText();

        // Remove multiple spaces between words
        let newText = text.replace(/ +(?= )/g, '');

        // Remove spaces before and after parentheses
        newText = newText.replace(/(?<=\w) \(/g, '(');
        newText = newText.replace(/\) (?=\w)/g, ')');

        // Remove spaces before and after brackets
        newText = newText.replace(/(?<=\w) \{/g, '{');
        newText = newText.replace(/\} (?=\w)/g, '}');

        // Remove spaces before and after commas
        newText = newText.replace(/(?<=\w) ,/g, ',');
        newText = newText.replace(/, (?=\w)/g, ',');

        // Remove spaces before and after colons
        newText = newText.replace(/(?<=\w) :/g, ':');
        newText = newText.replace(/: (?=\w)/g, ':');

        // Remove spaces before and after semicolons
        newText = newText.replace(/(?<=\w) ;/g, ';');
        newText = newText.replace(/; (?=\w)/g, ';');

        // Remove spaces before and after equals signs
        newText = newText.replace(/(?<=\w) =/g, '=');
        newText = newText.replace(/= (?=\w)/g, '=');

        // Remove empty lines
        newText = newText.replace(/^\s*[\r\n]/gm, '');

        // Remove all line breaks
        newText = newText.replace(/(\r\n|\n|\r)/gm, "");

        // Apply the changes
        editor.edit(editBuilder => {
            const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
            const fullRange = new vscode.Range(0, 0, editor.document.lineCount - 1, lastLine.range.end.character);
            editBuilder.replace(fullRange, newText);
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}