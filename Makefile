build: node_modules bin

bin: tsc target/workTimeCalculator

tsc: node_modules
	npm run build

node_modules:
	npm install

clean:
	rm -r target

run: tsc
	node ./target/main.js
