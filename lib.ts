import fs from 'fs';
import path from 'path';

export function extractLinks(text: string): string[] {
    let links = text.match(/[^!]\[.+?\]\(.+?\)/g);
    if (links === null) links = [];

    links = links.map((link) => link.trim());

    return links;
}

export function linkUrl(link: string): string {
    const url = link.match(/\]\((.+?)\)/);
    if (url === null) return "";

    return url[1];
}

export function relativeLinks(links: string[]): string[] {
    return links.filter((link) => {
        return link.match(/\(http/) === null && linkUrl(link).indexOf('#') === -1;
    });
}

export function isValidRelativeLink(root: string, link: string): boolean {
    try {
        const file = fs.statSync(path.join(root, link));
        return file.isFile() || file.isDirectory();
    } catch (e) {
        return false;
    }
}