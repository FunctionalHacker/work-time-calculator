.PHONY: build clean update-npmjs-readme release publish

build: node_modules
	npm run build

node_modules:
	npm install

clean:
	rm -r target node_modules

release:
	@read -p "Enter version bump (patch, minor, major): " bump && \
	version=$$(npm version $$bump | grep -oP "(?<=v)[^']+") && \
	echo "Version $$version created. Run 'make publish' to push the changes and publish the package."


update-npmjs-readme:
	asciidoctor -b docbook -o target/README.xml README.adoc
	pandoc -f docbook -t markdown_strict target/README.xml -o README.md

publish: update-npmjs-readme
	@git push && \
	git push --tags && \
	npm publish
