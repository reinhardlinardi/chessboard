.PHONY: all css js

all: css js
css:
	yarn run sass --no-source-map src/style:public/style
js:
	yarn run tsc