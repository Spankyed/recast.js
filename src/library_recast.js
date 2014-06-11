/*!
 * recast.js
 * https://github.com/vincent/recast.js
 *
 * Copyright 2014 Vincent Lark
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global mergeInto: true, LibraryManager: true, postMessage: true, Module: true, agentPool: true, agentPoolBuffer: true, ENVIRONMENT_IS_WORKER: true */
(function () {
  'use strict';

  mergeInto(LibraryManager.library, {

    flush_active_agents_callback: function() {
      Module.vent.emit('update', agentPoolBuffer);
      if (ENVIRONMENT_IS_WORKER) {
        postMessage({
          type: 'update',
          vent: true,
          data: [ agentPoolBuffer ]
        });
      }
    },

    invoke_vector_callback: function (callback_id, x, y, z) {
      Module.__RECAST_CALLBACKS[callback_id](x, y, z);
    },

    invoke_update_callback: function (callback_id) {
      Module.__RECAST_CALLBACKS[callback_id](agentPoolBuffer);
    },

    settings: function (options) {
      Module.set_cellSize(options.cellSize);
      Module.set_cellHeight(options.cellHeight);
      Module.set_agentHeight(options.agentHeight);
      Module.set_agentRadius(options.agentRadius);
      Module.set_agentMaxClimb(options.agentMaxClimb);
      Module.set_agentMaxSlope(options.agentMaxSlope);
    },

    agentPool_clear: function () {
      agentPoolBuffer.length = 0;
    },

    agentPool_add: function (idx) {
      agentPool.add(agentPoolBuffer[idx]);
    },

    agentPool_get: function (idx, position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius, active, state, neighbors) {
      agentPoolBuffer.push(agentPool.get(idx, position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius, active, state, neighbors));
    }
    
  });
})();
