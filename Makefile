.PHONY: help prod dev clean update-npmjs-readme release publish

help:
	@echo "Available targets:"
	@echo "  - help:           Show this help message"
	@echo "  - prod:           Build the project in production mode"
	@echo "  - dev:            Build the project in development mode"
	@echo "  - clean:          Remove build artifacts"
	@echo "  - release:        Create a new release version"
	@echo "  - publish:        Publish the new version created with the release target"

node_modules:
	npm install

prod: node_modules
	npm run prod

dev: node_modules
	npm run dev
	chmod +x dist/wtc-dev.mjs

clean:
	rm -r dist node_modules

release: prod
	@read -p "Enter version bump (patch, minor, major): " bump && \
	version=$$(npm version $$bump | grep -oP "(?<=v)[^']+") && \
	echo "Version $$version created. Run 'make publish' to push the changes and publish the package."

update-npmjs-readme:
	asciidoctor -b docbook -o dist/README.xml README.adoc
	pandoc -f docbook -t gfm dist/README.xml -o README.md

publish: update-npmjs-readme
	@git push && \
	git push --tags && \
	npm publish --otp $$(pass otp services/npmjs.com)
