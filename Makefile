build: node_modules bin

bin: tsc target/workTimeCalculator

tsc:
	npm run build

target/workTimeCalculator: target/main.js
	npx nexe target/main.js -t 18.17.1 --build -o target/workTimeCalculator

node_modules:
	npm install

clean:
	rm -r target
