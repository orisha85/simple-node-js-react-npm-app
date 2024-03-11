const express = require('express');
const cors = require('cors');
const config_url = require('./config_url');
const get_projects = require('./api/get_projects');
const get_tenants = require('./api/get_tenants');
const get_lov_activity = require('./api/get_lov_activity');
const get_lov_bidtype = require('./api/get_lov_bidtype');
const get_lov_jobtype = require('./api/get_lov_jobtype');
const get_lov_region = require('./api/get_lov_region');
const get_lov_skufamily = require('./api/get_lov_skufamily');
const get_lov_state = require('./api/get_lov_state');
const get_lov_town = require('./api/get_lov_town');
const get_lov_service_hub = require('./api/get_lov_service_hub');
const get_lov_region_state = require('./api/get_lov_region_state');
const get_labourstandards = require('./api/get_labourstandards');
const get_ProjectVersion = require('./api/get_projectVersion');
const get_project_information = require('./api/get_project_information');
const get_skuMaterial = require('./api/get_skuMaterial'); 
const get_cost_line_item = require('./api/get_projectCostLineItem');
const get_ProjectPriceLineItem = require('./api/get_projectPriceLineItem');
//const get_ProjectCostLineItem = require('./api/get_projectCostLineItem');
const get_ProjectCostMobalization = require('./api/get_projectCostMobalization');
const get_lov_sku_group = require('./api/get_lov_sku_group');
const get_drivedistance = require('./api/get_drivedistance');
const get_lov_town_region = require('./api/get_lov_town_region');
//const get_projectValuation = require('./api/get_projectValuation');
const get_projectLifecycle = require('./api/get_projectLifecycle');
const get_projectPriceSummary = require('./api/get_projectPriceSummary');
//const get_lookup_UoM = require('./api/get_lov_reference');
const get_projectValuation = require('./api/get_projectValuation');
const lookup_labourstandards = require('./api/lookup_labourstandards');
const lookup_skuMaterial = require('./api/lookup_skuMaterial');
const lookup_UoMConversion = require('./api/lookup_UoMConversion');
const lookup_drivedistance = require('./api/lookup_drivedistance');
const lookup_lifecycleDetails= require('./api/lookup_lifecycleDetails');

const merge_project = require('./api/merge_project');
const merge_projectVersion = require('./api/merge_projectVersion');
const merge_projectCostHeader = require('./api/merge_projectCostHeader');
const merge_projectCostLineItem = require('./api/merge_projectCostLineItem');
const merge_projectCostMobalization = require('./api/merge_projectCostMobalization');
const merge_projectPriceSummary = require('./api/merge_projectPriceSummary');
//const get_lov_project = require('./get_tenants');

const update_projectPriceLineItem = require('./api/update_projectPriceLineItem');
const update_projectVersion = require('./api/update_projectVersion');
const delete_projectCostLineItem = require('./api/delete_projectCostLineItem');
const create_new_project_id = require('./api/create_new_project_id');
const exec_projectPriceLine = require('./api/exec_projectPriceLine');

//const PORT = 3008;
//const STATIC_ASSETS_PATH = path.resolve(`${__dirname}/../../static`);

// Serve front end assets which have been built by webpack
app.use("/static", express.static(STATIC_ASSETS_PATH));

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

const app_data = express();
app_data.use(express.json());
app_data.use(cors(corsOptions))

// Endpoint for project list
//    app.get('/get_projects/:param1/:param2', async (req, res) => {
//        try {
//            const { param1, param2 } = req.params;
//            const result = await get_projects(param1, param2);
//            res.json(result);
//        } catch (error) {
//            res.status(500).json({ error: 'Internal Server Error' });
//        }
//    });
// Endpoint for tenant list


app_data.get('/get_tenants', async (req, res) => {
    try {
        const result = await get_tenants();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/create_new_project_id/', async (req, res) => {
    try {
        const result = await create_new_project_id();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error: Cant get new ID' });
    }
});

// Endpoint for project list
app_data.get('/get_projects/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_projects(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for SKU list
app_data.get('/get_sku_item/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_skuMaterial(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for SKU Group
app_data.get('/get_sku_group/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_sku_group(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for state
app_data.get('/get_lov_state/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_state(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Endpoint for activity
app_data.get('/get_lov_activity/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_activity(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint for bidtype
app_data.get('/get_lov_bidtype/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_bidtype(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint for jobtype
app_data.get('/get_lov_jobtype/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_jobtype(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint for region
app_data.get('/get_lov_region/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_region(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint for sku family
app_data.get('/get_lov_skufamily/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_skufamily(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for service hub
app_data.get('/get_lov_service_hub/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_service_hub(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/get_lov_region_state/:param_tenant/:state', async (req, res) => {
    try {
        const state = req.params.state;
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_region_state(param_tenant, state);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for cost line item
app_data.get('/get_cost_line_item/:param_tenant/:projectVersion', async (req, res) => {
    try {
        const projectVersion = req.params.projectVersion;
        const param_tenant = req.params.param_tenant;
        const result = await get_cost_line_item(param_tenant, projectVersion);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for projectVersion
app_data.get('/get_project_information/:param_tenant/:projectID', async (req, res) => {
    try {
        const projectID = req.params.projectID;
        
        const param_tenant = req.params.param_tenant;
        const result = await get_project_information(param_tenant, projectID);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for state
app_data.get('/get_lov_town/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_lov_town(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint for project list
app_data.get('/get_ratetypevalue/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_ratetypevalue(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for project list
app_data.get('/get_labourstandards/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_labourstandards(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/get_ProjectVersion/:param_tenant/:project_id', async (req, res) => {
    try {
        const project_id = req.params.project_id;
        const param_tenant = req.params.param_tenant;
        const result = await get_ProjectVersion(param_tenant, project_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/get_ProjectCostHeader/:param_tenant/:project_version_id', async (req, res) => {
    try {
        const project_version_id = req.params.project_version_id;
        const param_tenant = req.params.param_tenant;
        const result = await get_ProjectCostHeader(param_tenant, project_version_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app_data.get('/get_ProjectCostLineItem/:param_tenant/:project_version_id', async (req, res) => {
//     try {
//         const project_version_id = req.params.project_version_id;
//         const param_tenant = req.params.param_tenant;
//         const result = await get_ProjectCostLineItem(param_tenant, project_version_id);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app_data.get('/get_ProjectCostMobalization/:param_tenant/:project_version_id', async (req, res) => {
    try {
        const project_version_id = req.params.project_version_id;
        const param_tenant = req.params.param_tenant;
        const result = await get_ProjectCostMobalization(param_tenant, project_version_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/get_ProjectPriceLineItem/:param_tenant/:project_version_id', async (req, res) => {
    try {
        const project_version_id = req.params.project_version_id;
        const param_tenant = req.params.param_tenant;
        const result = await get_ProjectPriceLineItem(param_tenant, project_version_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Test123' });
    }
});

// app_data.get('/get_skuMaterial/:param_tenant/', async (req, res) => {
//     try {
//         const param_tenant = req.params.param_tenant;
//         const result = await get_skuMaterial(param_tenant);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app_data.get('/get_drivedistance/:param_tenant/', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await get_drivedistance(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/get_lov_town_region/:param_tenant/:Region', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const Region = req.params.Region;
        const result = await get_lov_town_region(param_tenant, Region);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/get_projectLifecycle', async (req, res) => {
    try {
        const result = await get_projectLifecycle();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/get_ProjectPriceSummary/:param_tenant/:project_version_id', async (req, res) => {
    try {
        const project_version_id = req.params.project_version_id;
        const param_tenant = req.params.param_tenant;
        const result = await get_projectPriceSummary(param_tenant, project_version_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Price summary not returned' });
    }
});

// app_data.get('/get_projectValuation/:param_tenant', async (req, res) => {
//     try {
//         const param_tenant = req.params.param_tenant;
//         const result = await get_projectValuation(param_tenant, Region);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app_data.get('/lookup_labourstandards/:param_tenant/:Project_Type/:SKU_Family/:SKU_Activity', async (req, res) => {
    try {
        const Project_Type = req.params.Project_Type;
        const SKU_Family = req.params.SKU_Family;
        const SKU_Activity = req.params.SKU_Activity;
        const param_tenant = req.params.param_tenant;
        const result = await lookup_labourstandards(param_tenant, Project_Type, SKU_Family, SKU_Activity);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/lookup_UoM/:param_tenant/:UoM', async (req, res) => {
    try {
        const UoM = req.params.UoM;
        const param_tenant = req.params.param_tenant;
        const result = await get_lookup_UoM(param_tenant, UoM);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/lookup_skuMaterial/:param_tenant/:SKU_ID', async (req, res) => {
    try {
        const SKU_ID = req.params.SKU_ID;
        const param_tenant = req.params.param_tenant;
        const result = await lookup_skuMaterial(param_tenant, SKU_ID);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/lookup_UoMConversion/:param_tenant/', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        const result = await lookup_UoMConversion(param_tenant, state);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.get('/lookup_drivedistance/:param_tenant/:ServiceHub/:TownCounty', async (req, res) => {
    try {
        const ServiceHub = req.params.ServiceHub;
        const TownCounty = req.params.TownCounty;
        const param_tenant = req.params.param_tenant;
        const result = await lookup_drivedistance(param_tenant, ServiceHub, TownCounty);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to merge project data
app_data.post('/merge_project', async (req, res) => {
    try {
      const result = await merge_project(req.body);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error merging data' });
    }
  });
  
// Endpoint to merge project data
app_data.post('/merge_projectCostHeader', async (req, res) => {
    try {
      const result = await merge_projectCostHeader(req.body);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error merging data' });
    }
  });
  
// Endpoint to merge project data
app_data.post('/merge_projectCostLineItem', async (req, res) => {
    try {
      const result = await merge_projectCostLineItem(req.body);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error merging data' });
    }
  });

  // Endpoint to merge project data
app_data.post('/merge_projectCostMobalization', async (req, res) => {
    try {
      const result = await merge_projectCostMobalization(req.body);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error merging data' });
    }
  });
  
// Endpoint to merge project data
app_data.post('/merge_projectVersion', async (req, res) => {
    try {
      const result = await merge_projectVersion(req.body);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error merging data' });
    }
  });

// Endpoint to merge project price summary
app_data.post('/merge_projectPriceSummary', async (req, res) => {
    try {
      const result = await merge_projectPriceSummary(req.body);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error merging data' });
    }
  });
 
// Endpoint to merge project price line item data
app_data.patch('/update_projectPriceLineItem/:projectPriceLineItem', async (req, res) => {
    const line_item = req.params.projectPriceLineItem;
    const { field_name, field_value } = req.body;
    try {
      const result = await update_projectPriceLineItem(line_item, field_name, field_value);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error updating data' });
    }
  });

  // Endpoint to merge project version 
app_data.patch('/update_projectVersion/:projectVersion', async (req, res) => {
    const project_version = req.params.projectVersion;
    const { field_name, field_value } = req.body;
    try {
      const result = await update_projectVersion(project_version, field_name, field_value);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error updating data' });
    }
  });

  app_data.get('/get_projectValuation/:param_tenant', async (req, res) => {
    try {
        const param_tenant = req.params.param_tenant;
        //console.log(param_tenant)
        const result = await get_projectValuation(param_tenant);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app_data.post('/exec_projectPriceLine/:project_version_id', async (req, res) => {
    try {
        const project_version_id = req.params.project_version_id;
        const result = await exec_projectPriceLine(project_version_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Price line items not summarized successfully ' });
    }
});


app_data.post('/delete_projectCostLineItem/:projectCostLineItem', async (req, res) => {
    try {
        const projectCostLineItem = req.params.projectCostLineItem;
        const result = await delete_projectCostLineItem(projectCostLineItem);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Price line items not summarized successfully ' });
    }
});

app_data.get('/lookup_lifecycleDetails/:lifecycle_cd', async (req, res) => {
    try {
        const lifecycle_cd = req.params.lifecycle_cd;
        const result = await get_projectValuation(lifecycle_cd);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error on lifecycle lookup' });
    }
});

// Create more endpoints for other queries
const PORT = config_url.port;
app_data.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});