const legend = document.querySelector('.map-legend');
if (legend) {
  legend.innerHTML = `
    <span><i class="legend-dot legend-city"></i>City</span>
    <span><i class="legend-dot legend-district"></i>District</span>
    <span><i class="legend-dot legend-hotel"></i>Hotel</span>
    <span><i class="legend-dot legend-facility"></i>Facility</span>
    <span><i class="legend-dot legend-island"></i>Island</span>
    <span><i class="legend-dot legend-park"></i>Park</span>`;
}
