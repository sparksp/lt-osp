SHELL = /bin/sh
target = public

all : $(target) ;

$(target) :
	-rm -r $@
	-mkdir -p $@
	hugo --gc --minify --ignoreCache --destination=$@

.PHONY : clean
clean :
	-rm -r $(target)

.PHONY : serve
serve :
	hugo serve --buildDrafts --buildFuture --navigateToChanged --watch
