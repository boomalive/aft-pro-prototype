"""Build the static comparison map from Basemap's real global shaded relief.

Usage: python tools/build_relief_map.py /path/to/shadedrelief.jpg
The source JPEG is in the basemap-data 2.0.0 wheel (PyPI).
Only the cropped, recoloured WebP and self-contained SVG ship to the browser.
"""
from pathlib import Path
from xml.etree import ElementTree as E
from PIL import Image, ImageOps
import base64
import math
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/concept/map'
source = Image.open(sys.argv[1]).convert('RGB')
width, height = 1600, 960
west, east, south, north = 23, 67, 51.5, 63.5
merc = lambda lat: math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
scale = 1000 / math.radians(east - west)
y_top = merc(north)
y_pad = (600 - (y_top - merc(south)) * scale) / 2

def source_y(y):
    map_y = y * 600 / height
    latitude = math.degrees(2 * math.atan(math.exp(y_top - (map_y - y_pad) / scale)) - math.pi / 2)
    return (90 - latitude) * source.height / 180

left = (west + 180) * source.width / 360
right = (east + 180) * source.width / 360
mesh = []
for top in range(0, height, 12):
    bottom = min(top + 12, height)
    mesh.append(((0, top, width, bottom), (left, source_y(top), left, source_y(bottom), right, source_y(bottom), right, source_y(top))))
crop = source.transform((width, height), Image.Transform.MESH, mesh, Image.Resampling.BICUBIC)
tone = ImageOps.autocontrast(crop.convert('L'), cutoff=1)
relief = ImageOps.colorize(tone, '#9ab5c0', '#f8f9fa')
relief.save(OUT / 'relief.webp', 'WEBP', quality=82, method=6)

ns = 'http://www.w3.org/2000/svg'
E.register_namespace('', ns)
tree = E.parse(OUT / 'offices.svg').getroot()
tree.find('{' + ns + '}title').text = 'География АФТ ПРО: вариант с рельефом'
tree.find('{' + ns + '}desc').text = 'Реальный затенённый рельеф, реки, озёра и границы. Усть-Луга, Москва, Нижний Новгород и Екатеринбург отмечены в центрах городов. Картография Natural Earth и Basemap.'
style = tree.find('{' + ns + '}style')
style.text = style.text.replace('stroke-width:5px', 'stroke-width:6px')
group = tree.find('{' + ns + '}g')
image = E.Element('{' + ns + '}image', {'width': '1000', 'height': '600', 'href': 'data:image/webp;base64,' + base64.b64encode((OUT / 'relief.webp').read_bytes()).decode(), 'preserveAspectRatio': 'none'})
group.insert(0, image)
for path in group.findall('{' + ns + '}path'):
    if path.get('fill-rule') == 'evenodd':
        path.set('fill-opacity', '.1')
        path.set('stroke-opacity', '.7')
    elif path.get('d') == 'M0 0H1000V600H0Z':
        path.set('fill-opacity', '0')
    elif path.get('stroke-dasharray'):
        path.set('stroke-opacity', '.55')
    elif path.get('fill') == 'none':
        path.set('stroke', '#567988')
        path.set('stroke-opacity', '.55')
# Four labelled markers are copied without changing the original coordinates.
for text in group.findall('{' + ns + '}text'):
    if text.get('class') != 'city-label':
        text.set('opacity', '.45')
E.ElementTree(tree).write(OUT / 'offices-relief.svg', encoding='unicode')
print('WebP:', (OUT / 'relief.webp').stat().st_size, 'bytes; SVG:', (OUT / 'offices-relief.svg').stat().st_size, 'bytes')
