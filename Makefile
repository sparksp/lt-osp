SHELL = /bin/sh

.PHONY: all build clean deploy-preview branch-deploy production-build serve

all: build ## Build site with production settings

clean:
	-rm -r public

build: clean ## Build site with non-production settings and put deliverables in ./public
	until timeout -s SIGABRT 5m hugo --cleanDestinationDir --minify --environment development ; do : ; done

deploy-preview: ## Deploy preview site via netlify
	until timeout -s SIGABRT 5m hugo --cleanDestinationDir --enableGitInfo --buildFuture --environment preview -b $(DEPLOY_PRIME_URL) ; do : ; done

branch-deploy: ## Build site with drafts and future posts enabled
	until timeout -s SIGABRT 5m hugo --cleanDestinationDir --buildDrafts --buildFuture --environment preview -b $(DEPLOY_PRIME_URL) ; do : ; done

production-build: ## Build the production site and ensure that noindex headers aren't added
	until timeout -s SIGABRT 5m hugo --cleanDestinationDir --minify --environment production ; do : ; done

serve : ## Boot the development server.
	hugo server --buildFuture --navigateToChanged --watch --environment development
