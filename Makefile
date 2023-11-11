build: node_modules
	npm run build

node_modules:
	npm install

clean:
	rm -r target node_modules
