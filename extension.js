const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('remove-whitespace', async function () {
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

        // Match URLs and replace them with a placeholder
        let urls = [];
        newText = newText.replace(/https?:\/\/[^\s]+/g, (match) => {
            urls.push(match);
            return 'URL_PLACEHOLDER';
        });

        // Now remove single line and multi-line comments
        newText = newText.replace(/(\/\*[^]*?\*\/)|(\/\/.*)/g, '');

        // Finally, restore the URLs
        urls.forEach((url, index) => {
            newText = newText.replace('URL_PLACEHOLDER', url);
        });

        // Remove all line breaks
        newText = newText.replace(/(\r\n|\n|\r)/gm, "");

        // Apply the changes
        await editor.edit(async editBuilder => {
            const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
            const fullRange = new vscode.Range(0, 0, editor.document.lineCount - 1, lastLine.range.end.character);
            editBuilder.replace(fullRange, newText);
        });

        // Select text
        let fullRange = new vscode.Range(
            editor.document.positionAt(0),
            editor.document.positionAt(editor.document.getText().length)
        );

        editor.selection = new vscode.Selection(fullRange.start, fullRange.end);

        // Undo text
        vscode.env.clipboard.writeText(editor.document.getText(editor.selection));
        vscode.commands.executeCommand('undo');
    });

    context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}

