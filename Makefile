all: layout
clean:
	@rm -f index.html style.css

layout:
	@yarn run pug layout -o . -P >/dev/null

.PHONY: all clean layout
