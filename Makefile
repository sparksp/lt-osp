SHELL = /bin/sh
target = public

all : $(target) ;

$(target) :
	hugo --gc --i18n-warnings -d $@

.PHONY : clean
clean :
	-rm -r $(target)

.PHONY : serve
serve :
	hugo serve --buildDrafts --navigateToChanged --i18n-warnings --watch
