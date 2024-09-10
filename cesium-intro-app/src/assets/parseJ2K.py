from astropy import coordinates as coord
from astropy import units as u
from astropy import time
from astropy.time import Time
import json

# Function to convert J2K coordinates to Earth Location (latitude, longitude, altitude)
def j2k_to_geojson(input_file, output_file):
    data = []

    # Read J2K data from the file
    with open(input_file, 'r') as file:
        lines = file.readlines()

    end_comment_index = next((i for i, line in enumerate(lines) if 'COMMENT End sequence of events' in line), None)

    print(end_comment_index)

    # Extract the relevant data lines (after COMMENT header)
    for line in lines[end_comment_index:]:
        if line.strip() and not line.startswith('COMMENT') and '-' in line:
            parts = line.split()
            time = parts[0]  # Time in ISO format
            print(parts)
            x, y, z = map(float, parts[1:4])  # J2K position coordinates in meters
            
            cartrep = coord.CartesianRepresentation(x,y, z, unit=u.km)
            gcrs = coord.GCRS(cartrep, obstime = time)
            itrs = gcrs.transform_to(coord.ITRS(obstime = time))
            loc = coord.EarthLocation(*itrs.cartesian.xyz)

            # Convert ITRS to geodetic coordinates (latitude, longitude, altitude)
            lat = loc.lat.deg
            lon = loc.lon.deg
            alt = loc.height.to(u.m).value

            # Append data to the GeoJSON structure
            data.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat, alt]
                },
                "properties": {
                    "timestamp": time
                }
            })

    # Create the GeoJSON structure
    geojson = {
        "type": "FeatureCollection",
        "features": data
    }

    # Write the GeoJSON to the output file
    with open(output_file, 'w') as out_file:
        json.dump(geojson, out_file, indent=2)

# Usage
input_file = '/Users/dhawaldeepgaur/Documents/GitHub/ncircle-r3f-cesium-training/cesium-intro-app/src/assets/ISS.OEM_J2K_EPH.txt'  # Replace with your input file path
output_file = '/Users/dhawaldeepgaur/Documents/GitHub/ncircle-r3f-cesium-training/cesium-intro-app/src/assets/iss_trajectory.geojson'  # Output GeoJSON file path
j2k_to_geojson(input_file, output_file)

print(f"GeoJSON file has been generated: {output_file}")
