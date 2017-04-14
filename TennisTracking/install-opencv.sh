# Run this command to install opencv onto your linux machine
# KEEP UBUNTU OR DEBIAN UP TO DATE

sudo apt-get -y update
sudo apt-get -y upgrade

# INSTALL THE DEPENDENCIES

# Build tools:
sudo apt-get install -y build-essential cmake pkg-config

# Image I/O packages:
sudo apt-get install -y libjpeg-dev libtiff5-dev libjasper-dev libpng12-dev

# Video I/O packages:
sudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
sudo apt-get install -y libxvidcore-dev libx264-dev

# GUI
sudo apt-get install -y libgtk2.0-dev

# Optimization libraries:
sudo apt-get install -y libatlas-base-dev gfortran

# Python 2.7 and 3.0 header files:
sudo apt-get install -y python2.7-dev python3-dev

# INSTALL OPENCV

# Download OpenCV 3.1.0:
cd ~
wget -O opencv.zip https://github.com/Itseez/opencv/archive/3.1.0.zip
unzip opencv.zip

# Download opencv_contrib repository:
wget -O opencv_contrib.zip https://github.com/Itseez/opencv_contrib/archive/3.1.0.zip
unzip opencv_contrib.zip

# Download and Install Python package manager:
wget https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py

# Install virtualenv and virtualenvwrapper
sudo pip install virtualenv virtualenvwrapper
sudo rm -rf ~/.cache/pip

# update ~/.profile
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
echo -e "\n# virtualenv and virtualenvwrapper" >> ~/.profile
echo "export WORKON_HOME=$HOME/.virtualenvs" >> ~/.profile
echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.profile
source ~/.profile
mkvirtualenv cv -p python3

# Install Numpy and imutils:
sudo pip install imutils
sudo pip install numpy

# Setup build using CMake:
cd ~/opencv-3.1.0/
mkdir build
cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D INSTALL_PYTHON_EXAMPLES=ON \
    -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib-3.1.0/modules \
    -D BUILD_EXAMPLES=ON ..

# Compile OpenCV:
make -j4

# Install OpenCV 3
sudo make install
sudo ldconfig

cd /usr/local/lib/python3.4/site-packages/
sudo mv cv2.cpython-34m.so cv2.so
cd ~/.virtualenvs/cv/lib/python3.4/site-packages/
ln -s /usr/local/lib/python3.4/site-packages/cv2.so cv2.so

# Cleanup
rm -rf opencv-3.1.0 opencv_contrib-3.1.0
rm opencv_contrib.zip opencv.zip get-pip.py
