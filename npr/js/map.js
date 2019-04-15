require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/GeoJSONLayer",
  "esri/Graphic",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/symbols/WebStyleSymbol",
  "esri/tasks/support/Query",
  "esri/geometry/SpatialReference",
  "esri/Basemap",
  "esri/geometry/support/webMercatorUtils",
  "esri/widgets/Expand",
  "esri/widgets/BasemapGallery"
], function(
  Map,
  SceneView,
  GraphicsLayer,
  FeatureLayer,
  GeoJSONLayer,
  Graphic,
  SketchViewModel,
  WebStyleSymbol,
  Query,
  SpatialReference,
  Basemap,
  webMercatorUtils,
  Expand,
  BasemapGallery
) {
  // the layer where the graphics are sketched
  const gLayer = new GraphicsLayer();
  

  var basemap = new Basemap({
    portalItem: {
      id: "8dda0e7b5e2d4fafa80132d59122268c"  // WGS84 Streets Vector webmap
    }
  });

  const map = new Map({
    basemap: "satellite",
    //basemap: basemap,wgs84
    layers: [gLayer],
    ground: "world-elevation",
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      //position: [-98.58, 39.83,  19899000],
/*       position: [-105.6050, 40.3528, 3000],
      heading: -90,
      tilt: 85.35 */ //rocky mountain np

      position: [-121.78369566084515, 46.99354698643403, 4000],
      heading: 165,
      tilt: 77.35
    },
  });

  view.extent = {
    xmin: -9177882,
    ymin: 4246761,
    xmax: -9176720,
    ymax: 4247967,
    spatialReference:{ wkid: 4326 }
  };

  var basemapGallery = new BasemapGallery({
    view: view,
    container: document.createElement("div")
  });

  var bgExpand = new Expand({
    view: view,
    content: basemapGallery
  });

  basemapGallery.watch("activeBasemap", function() {
    var mobileSize =
      view.heightBreakpoint === "xsmall" ||
      view.widthBreakpoint === "xsmall";

    if (mobileSize) {
      bgExpand.collapse();
    }
  });

  // Add the expand instance to the ui

  view.ui.add(bgExpand, "bottom-right");
  const url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

  const poiJSON = 
  "data/poi.geojson";

  const template = {
    title: "Earthquake Info",
    content: "Magnitude {mag} {type} hit {place} on {time:DateString}"
  };

  const renderer = {
    type: "simple",
    field: "mag",
    symbol: {
      type: "simple-marker",
      color: "orange",
      outline: {
        color: "white"
      }
    },
    visualVariables: [
      {
        type: "size",
        field: "mag",
        stops: [
          {
            value: 2.5,
            size: "4px"
          },
          {
            value: 8,
            size: "40px"
          }
        ]
      }
    ]
  };

  const geojsonLayer = new GeoJSONLayer({
    url: url,
    copyright: "USGS Earthquakes",
    popupTemplate: template,
    renderer: renderer //optional
  });

  const poijsonlayer = new GeoJSONLayer({
    url: poiJSON
  });

  map.add(poijsonlayer);

  map.add(geojsonLayer);

  const labelClass = {
    // autocasts as new LabelClass()
    symbolLayers: [
      {
        type: "text", // autocasts as new TextSymbol3DLayer()
        material: {
          color: "black"
        },
        halo: {
          color: [255, 255, 255, 0.7],
          size: 2
        },
        size: 10
      }
    ],
    verticalOffset: {
      screenLength: 50,
      maxWorldLength: 2000,
      minWorldLength: 30
    },
    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.UNIT_NAME"
    }
  };

  const labelClass2 = {
    // When using callouts on labels, "above-center" is the only allowed position
    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.UNIT_NAME"
    },
    symbol: {
      type: "label-3d", // autocasts as new LabelSymbol3D()
      symbolLayers: [
        {
          type: "text", // autocasts as new TextSymbol3DLayer()
          material: {
            color: "black"
          },
          halo: {
            color: [255, 255, 255, 0.7],
            size: 2
          },
          size: 10
        }
      ],
      // Labels need a small vertical offset that will be used by the callout
      verticalOffset: {
        screenLength: 150,
        maxWorldLength: 2000,
        minWorldLength: 30
      },
      // The callout has to have a defined type (currently only line is possible)
      // The size, the color and the border color can be customized
      callout: {
        type: "line", // autocasts as new LineCallout3D()
        size: 0.5,
        color: [0, 0, 0],
        border: {
          color: [255, 255, 255, 0.7]
        }
      }
    }
  };

  var parkBound = new FeatureLayer({
    url:
      "https://services1.arcgis.com/fBc8EJBxQRMcHlei/ArcGIS/rest/services/NPS_Park_Boundaries/FeatureServer/0",
    labelingInfo: [labelClass2]
  });

  console.log(parkBound.fields)

  parkBound.renderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    symbol: {
        "color": [26, 26, 26, 255],
        "width": 4,
        "type": "simple-line",
        "style": "dot"
    }
  };

  $('#parkselect').on('change', function() {
    view.goTo(parks[this.value]);
  });

  function sortlist() {
    var options = $('#parkselect option');
    var arr = options.map(function(_, o) {
        return {
            t: $(o).text(),
            v: o.value
        };
    }).get();
    arr.sort(function(o1, o2) {
        return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
    });
    options.each(function(i, o) {
        console.log(i);
        o.value = arr[i].v;
        $(o).text(arr[i].t);
    });
};

  map.add(parkBound);

  var query = parkBound.createQuery();
  query.outFields = ["UNIT_NAME"];
  var parkslist = [];
  //query list of parks, this is slow, might want to hardcode
  parkBound.queryFeatures(query)
  .then(function(response){
    parks = response.features;
    var parkselect = document.getElementById("parkselect");
    var i;
      for (i = 0; i < parks.length; i++) { 
        currentPark = response.features[i].attributes.UNIT_NAME;
        parkslist.push(response.features[i].attributes.UNIT_NAME);
        //console.log(currentPark);
        //need to figure out how to append to combobox
        //console.log(i);
        parkvalue = i++;
        //console.log("value plus" + parkvalue) ;
        $('#parkselect').append('<option value='+parkvalue+'>'+currentPark+'</option>');
    };
    //console.log(parkslist);
    sortlist();
    document.getElementById("loading").innerHTML = "Select a Park";
    //parkselect.remove(0);
   });




  const blue = [82, 82, 122, 0.9];
  const white = [255, 255, 255, 0.8];

  // polygon symbol used for sketching the extruded building footprints
  const extrudedPolygon = {
    type: "polygon-3d",
    symbolLayers: [
      {
        type: "extrude",
        size: 10, // extrude by 10 meters
        material: {
          color: white
        },
        edges: {
          type: "solid",
          size: "3px",
          color: blue
        }
      }
    ]
  };

  // polyline symbol used for sketching routes
  const route = {
    type: "line-3d",
    symbolLayers: [
      {
        type: "line",
        size: "3px",
        material: {
          color: blue
        }
      },
      {
        type: "line",
        size: "10px",
        material: {
          color: white
        }
      }
    ]
  };

  // point symbol used for sketching points of interest
  const point = {
    type: "point-3d",
    symbolLayers: [
      {
        type: "icon",
        size: "20px",
        resource: { primitive: "kite" },
        outline: {
          color: blue,
          size: "3px"
        },
        material: {
          color: white
        }
      }
    ]
  };
 
  cpcoord = []
  function crackPaths(){
    //pathstr = path.toString();
    //pathstr = pathstr.replace(/([-\d.]+),([-\d.]+),?/g, '$1 $2, ').trim();
    //console.log(path.length);
    var i;
    for (i = 0; i < path.length; i++) { 
      var test = webMercatorUtils.xyToLngLat(path[i][0], path[i][1]);
      console.log(test);
      cpcoord.push(test);
      //console.log(test);
  };
/*     var x = 0;
  var len = cpcoord.length
  console.log(len)
  while(x < len){ 
      cpcoord[x] = parseFloat(cpcoord[x]).toFixed(2); 
      x++
  }; */
    cpcoordstr = cpcoord.toString();
    cpcoordstr = cpcoordstr.replace(/([-\d.]+),([-\d.]+),?/g, '$1 $2, ').trim();
    //console.log(cpcoordstr);
  };

/*   document.getElementById("report").addEventListener("click",function reporter(){
    var objects = gLayer.graphics;
    var pointLat = gLayer.graphics.items[0].geometry.latitude;
    var pointLon = gLayer.graphics.items[0].geometry.longitude;
    prepath = gLayer.graphics.items[0].geometry.paths;
    path = gLayer.graphics.items[0].geometry.paths[0];
    crackPaths();
    console.log(objects);
    //console.log(gLayer.graphics.items[0]);
    //console.log(pointLat + "" + pointLon);
    //console.log(objects);
    //console.log(gLayer.graphics.items[1].symbol.type);
    });
 */
    function reporter(){
      var objects = gLayer.graphics;
      var pointLat = gLayer.graphics.items[0].geometry.latitude;
      var pointLon = gLayer.graphics.items[0].geometry.longitude;
      prepath = gLayer.graphics.items[0].geometry.paths;
      path = gLayer.graphics.items[0].geometry.paths[0];
      crackPaths();
      //console.log(objects);
      //console.log(gLayer.graphics.items[0]);
      //console.log(pointLat + "" + pointLon);
      //console.log(objects);
      //console.log(gLayer.graphics.items[1].symbol.type);
      };
  // define the SketchViewModel and pass in the symbols for each geometry type
  const sketchVM = new SketchViewModel({
    layer: gLayer,
    view: view,
    pointSymbol: point,
    polygonSymbol: extrudedPolygon,
    polylineSymbol: route
  });

  // add an event listener for the Delete key to delete
  // the graphics that are currently being updated
  view.on("key-up", function(evt) {
    if (evt.key === "Delete") {
      gLayer.removeMany(sketchVM.updateGraphics);
      sketchVM.reset();
    }
  });

  // after drawing the geometry, enter the update mode to update the geometry
  // and the deactivate the buttons
  sketchVM.on("create", function(event) {
    if (event.state === "complete") {
      sketchVM.update(event.graphic);
      deactivateButtons();
      reporter();
      console.log("these are the coordinates to pass: " + cpcoordstr);
    }
  });

  const drawButtons = Array.prototype.slice.call(
    document.getElementsByClassName("esri-button")
  );

  // set event listeners to activate sketching graphics
  drawButtons.forEach(function(btn) {
    btn.addEventListener("click", function(event) {
      deactivateButtons();
      event.target.classList.add("esri-button--secondary");
      // to activate sketching the create method is called passing in the geometry type
      // from the data-type attribute of the html element
      sketchVM.create(event.target.getAttribute("data-type"));
    });
  });

  function deactivateButtons() {
    drawButtons.forEach(function(element) {
      element.classList.remove("esri-button--secondary");

    });
  }

  view.ui.add("sketchPanel", "top-right");
});