# Map Tile Server

This map tile server is using a docker image provided by [openmaptiles.org](https://openmaptiles.org/docs/). Reasons for using the docker image is ease of use and install as well as the server's built in ability to serve raster images (PNG) of map tiles. We needed this ability because our map renderer of choice, [Leaflet](leafletjs.com), could only render maps using raster images.

## Install

There is a provided install script for Docker on Ubuntu 16.04 (Xenial).
There is also another script for quickly running the Docker container.

1. In the directory, set execute permissions for each  script


	chmod +x maptileserver.sh install-docker-ubuntu1604.sh

2. Run the Docker install script or install Docker for your machine 


	sudo ./install-docker-ubuntu1604.sh
    
4. Download mbtiles for united states of america

	
    wget https://openmaptiles.os.zhdk.cloud.switch.ch/v3.3/extracts/united_states_of_america.mbtiles
    
3. Start Docker container

	
    sudo ./maptileserver.sh

##### The map tile server by default will run on port 8080 (e.g. localhost/8080). If you need to change the starting port then refer to this [documentation.](https://tileserver.readthedocs.io/en/latest/usage.html)
