import yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import * as lib from './lib'

function recFindByExt(
    base: string,
    ext: string,
    files: string[] = [],
    result: string[] = []): string[] {
    if (files.length === 0){
        files = fs.readdirSync(base);
    }

    files.forEach((file) => {
        const newbase = path.join(base, file);
        if (fs.statSync(newbase).isDirectory()) {
            result = recFindByExt(newbase, ext, fs.readdirSync(newbase), result);
        }
        else {
            if ( file.substr(-1*(ext.length+1)) == '.' + ext ) {
                result.push(newbase);
            }
        }
    })
    return result
}

export function main(): void {
    const foundArgs = yargs
        .alias('root', 'r')
        .describe('root', 'The Github repo to analyize')
        .default('root', process.cwd())
        .argv;

    const root = foundArgs.root;

    const markdownFiles = recFindByExt(root, 'md')
        .filter((file) => file.indexOf('node_modules') === -1);

    markdownFiles.forEach((markdownFile) => {
        fs.readFile(markdownFile, (err, content) =>{
            const contentAsString = content.toString();

            const links = lib.extractLinks(contentAsString);
            const relativeLinks = lib.relativeLinks(links);
            const dirname = path.dirname(markdownFile);

            relativeLinks.map((link) => {
                const linkUrl = lib.linkUrl(link);
                if (!lib.isValidRelativeLink(dirname, linkUrl)){
                    console.log(`Invalid link ${link} in ${markdownFile}`);
                }
            });
        });
    })

}

main();