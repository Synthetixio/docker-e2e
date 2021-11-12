
FROM ghcr.io/synthetixio/docker-node/ubuntu:17.1

# disable shared memory X11 affecting Cypress v4 and Chrome
# https://github.com/cypress-io/cypress-docker-images/issues/270
ENV QT_X11_NO_MITSHM=1
ENV _X11_NO_MITSHM=1
ENV _MITSHM=0
# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null
# point Cypress at the /root/cache no matter what user account is used
# see https://on.cypress.io/caching
ENV CYPRESS_CACHE_FOLDER=${HOME}/.cache/Cypress
# lang setup
ENV LANG_WHICH en
ENV LANG_WHERE US
ENV ENCODING UTF-8
ENV LANGUAGE ${LANG_WHICH}_${LANG_WHERE}.${ENCODING}
ENV LANG ${LANGUAGE}

# install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    software-properties-common \
    libgtk2.0-0 \
    libgtk-3-0 \
    libnotify-dev \
    libgconf-2-4 \
    libgbm-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    tzdata \
    language-pack-en \
    # install Chinese fonts
    ttf-ubuntu-font-family \
    fonts-arphic-bkai00mp \
    fonts-arphic-bsmi00lp \
    fonts-arphic-gbsn00lp \
    fonts-arphic-gkai00mp \
    fonts-arphic-ukai \
    fonts-arphic-uming \
    ttf-wqy-zenhei \
    ttf-wqy-microhei \
    xfonts-wqy \
    libfontconfig \
    libfreetype6 \
    xfonts-cyrillic \
    xfonts-scalable \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-tlwg-loma-otf \
    # selenium dependencies
    bzip2 \
    ca-certificates \
    openjdk-11-jre-headless \
    jq \
    gnupg2 \
    # Chrome dependencies
    libgbm1 \
    fonts-liberation \
    xdg-utils \
    # Cypress dependencies
    zip \
    mplayer \
    ffmpeg \
    imagemagick \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
    && sed -i 's/securerandom\.source=file:\/dev\/random/securerandom\.source=file:\/dev\/urandom/' ./usr/lib/jvm/java-11-openjdk-amd64/conf/security/java.security

# setup timezone
ENV TZ "UTC"
RUN echo "${TZ}" > /etc/timezone \
  && dpkg-reconfigure --frontend noninteractive tzdata

# lang setup
RUN locale-gen ${LANGUAGE} \
    && dpkg-reconfigure --frontend noninteractive locales

# install Chrome browser
RUN wget -O /usr/src/google-chrome-stable_current_amd64.deb "http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_95.0.4638.69-1_amd64.deb" && \
    dpkg -i /usr/src/google-chrome-stable_current_amd64.deb ; \
    apt-get install -f -y && \
    rm -f /usr/src/google-chrome-stable_current_amd64.deb

# install Firefox browser
RUN wget --no-verbose -O /tmp/firefox.tar.bz2 https://download-installer.cdn.mozilla.net/pub/firefox/releases/94.0.1/linux-x86_64/en-US/firefox-94.0.1.tar.bz2 \
    && tar -C /opt -xjf /tmp/firefox.tar.bz2 \
    && rm /tmp/firefox.tar.bz2 \
    && ln -fs /opt/firefox/firefox /usr/bin/firefox

# install needed global npm modules
RUN npm install -g @lhci/cli@0.8.2 lighthouse@8.6.0 sitespeed.io@20.5.0 webdriver-manager@12.1.8

# install and setup plugins required by sitespeed.io
WORKDIR /usr/local/lib/node_modules/sitespeed.io/lib/plugins
RUN git clone https://github.com/sitespeedio/plugin-lighthouse.git --depth 1 --branch=main && \
    git clone https://github.com/sitespeedio/plugin-gpsi.git --depth 1 --branch=main
WORKDIR /usr/local/lib/node_modules/sitespeed.io/lib/plugins/plugin-lighthouse
RUN npm install
WORKDIR /usr/local/lib/node_modules/sitespeed.io/lib/plugins/plugin-gpsi
RUN npm install && mv lib/* .
WORKDIR $HOME

# install selenium drivers (ChromeDriver, GeckoDriver, etc)
RUN npx webdriver-manager update --ignore_ssl --versions.standalone 3.141.59 --versions.chrome 95.0.4638.54 --versions.gecko v0.30.0

# give every user read access to the "/root" folder where the Cypress binary is cached
# we really only need to worry about the top folder, fortunately
RUN ls -la $HOME
RUN chmod 755 $HOME

# command "id" should print:
# uid=0(root) gid=0(root) groups=0(root)
# which means the current user is root
RUN id

# Cypress cache and installed version
# should be in the root user's home folder
RUN npx cypress verify
RUN npx cypress cache path
RUN npx cypress cache list
RUN npx cypress info

# Node libraries
RUN node -p process.versions

# print versions of local tools
RUN echo  "node version:  $(node -v) \n" \
  "npm version:           $(npm -v) \n" \
  "yarn version:          $(yarn -v) \n" \
  "Selenium version:      3.141.59 \n" \
  "Chrome version:        $(google-chrome --version || true) \n" \
  "Chromedriver version:  95.0.4638.54 \n" \
  "Firefox version:       $(firefox --version || true) \n" \
  "Geckodriver version:   0.30.0 \n" \
  "git version:           $(git --version) \n" \
  "user:                  $(whoami) \n" \
  "ubuntu version:        $(cat /etc/lsb-release)"
