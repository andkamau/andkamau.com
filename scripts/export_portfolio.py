"""Generate the public Markdown portfolio from semantic page content."""
import argparse
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://andkamau.com/'


class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def find(self, tag=None, cls=None):
        return [n for n in self.walk() if (tag is None or n.tag == tag)
                and (cls is None or cls in n.attrs.get('class', '').split())]

    def walk(self):
        for child in self.children:
            if isinstance(child, Node):
                yield child
                yield from child.walk()

    def text(self, links=False):
        if self.tag in ('svg', 'script', 'style') or 'visually-hidden' in self.attrs.get('class', '').split():
            return ''
        value = ''.join(c.text(links) if isinstance(c, Node) else c for c in self.children)
        value = re.sub(r'\s+', ' ', value).strip()
        if links and self.tag == 'a':
            return '[' + value.replace('[', '\\[').replace(']', '\\]') + '](' + urljoin(SITE, self.attrs['href']) + ')'
        return value


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in ('area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'):
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def generate(source):
    page = Page(source).root
    intro = page.find('header')[0]
    lines = ['# ' + intro.find('h1')[0].text(), '', intro.find(cls='quiet')[0].text(), '',
             'Source: ' + SITE, '', '## Contact', '']
    lines += ['- ' + a.text(True) for a in intro.find(cls='contact-links')[0].find('a')
              if a.attrs.get('id') != 'view-portfolio']
    for group in page.find(cls='work-group'):
        lines += ['', '## ' + group.find('h2')[0].text(), '', group.find(cls='work-description')[0].text(), '']
        lines += ['- ' + a.text(True) for a in group.find(cls='proof-links')[0].find('a')]
        for coverage in group.find(cls='coverage'):
            lines += ['', coverage.text(True)]
    lines += ['', '## Talks', '']
    for item in page.find(cls='talk-list')[0].find('li'):
        anchors = item.find('a')
        lines += ['- ' + anchors[0].text(True)]
        lines += ['  ' + detail.text() for detail in item.find(cls='item-detail')]
        if len(anchors) > 1:
            lines += ['  ' + ' · '.join(a.text(True) for a in anchors[1:])]
    return '\n'.join(lines) + '\n'


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    result = generate((ROOT / 'index.html').read_text())
    target = ROOT / 'portfolio.md'
    if args.check:
        if not target.exists() or target.read_text() != result:
            raise SystemExit('portfolio.md is outdated. Run python3 scripts/export_portfolio.py')
        print('Markdown matches the page.')
    else:
        target.write_text(result)
        print('Generated portfolio.md')
