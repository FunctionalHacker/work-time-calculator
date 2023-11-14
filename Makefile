.PHONY: help build clean update-npmjs-readme release publish

help:
	@echo "Available targets:"
	@echo "  - help:           Show this help message"
	@echo "  - build:          Build the project"
	@echo "  - clean:          Remove build artifacts"
	@echo "  - release:        Create a new release version"
	@echo "  - publish:        Publish the new version created with the release target"

node_modules:
	npm install

build: node_modules
	npm run build

clean:
	rm -r target node_modules

release:
	@read -p "Enter version bump (patch, minor, major): " bump && \
	version=$$(npm version $$bump | grep -oP "(?<=v)[^']+") && \
	echo "Version $$version created. Run 'make publish' to push the changes and publish the package."

update-npmjs-readme:
	asciidoctor -b docbook -o target/README.xml README.adoc
	pandoc -f docbook -t gfm target/README.xml -o README.md

publish: update-npmjs-readme
	@git push && \
	git push --tags && \
	npm publish
