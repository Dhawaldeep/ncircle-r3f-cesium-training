from pyproj import Transformer

# Define the source CRS (EPSG:2169) and target CRS (EPSG:4326 for WGS84)
transformer = Transformer.from_crs("EPSG:2169", "EPSG:4326", always_xy=True)

# Input coordinates
eastings = 76670.0
northings = 77179.0
orthogonal_height = 293.700012207031

# Perform the transformation
longitude, latitude, height = transformer.transform(eastings, northings, orthogonal_height)

# Display the results
print(f"Longitude: {longitude}, Latitude: {latitude}, Height: {height}")
# Longitude: 6.122030651008337, Latitude: 49.629212050233804, Height: 293.700012207031
