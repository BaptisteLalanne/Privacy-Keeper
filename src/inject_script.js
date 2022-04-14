const dashboard_entry_point = document.createElement('div');
let reactJS_script = document.createElement('script');

dashboard_entry_point.id = 'dashboard';
reactJS_script.src = 'dashboard.bundle.js';

dashboard_entry_point.appendChild(reactJS_script);

document.querySelector("body").appendChild(dashboard_entry_point);