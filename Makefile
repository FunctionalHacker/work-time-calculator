.PHONY: build clean update-npmjs-readme

build: node_modules
	npm run build

node_modules:
	npm install

clean:
	rm -r target node_modules

update-npmjs-readme:
	asciidoctor -b docbook -o target/README.xml README.adoc
	pandoc -f docbook -t markdown_strict target/README.xml -o README.md
