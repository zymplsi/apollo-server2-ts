/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "2b67baacc3164fc32168";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + (err.stack || err.message));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log(
							"warning",
							"[HMR] Update failed: " + (err.stack || err.message)
						);
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./src/db/mongo/config.ts":
/*!********************************!*\
  !*** ./src/db/mongo/config.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
const environment_1 = __webpack_require__(/*! ../../environment */ "./src/environment.ts");
const geo_points_db_schema_1 = __importDefault(__webpack_require__(/*! ./schemas/geo-points.db.schema */ "./src/db/mongo/schemas/geo-points.db.schema.ts"));
const mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true
};
const mongodbUri = environment_1.environment.mongo.url;
mongoose.set("debug", "development" !== "production");
const db = mongoose.createConnection(mongodbUri, mongoOptions);
db.on("error", err => {
    console.warn(`${err}, db connectionn error!`, { label: "startup" });
});
db.once("open", () => {
    console.info("db connection success...", { label: "startup" });
});
try {
    db.model("geopoints");
}
catch (e) {
    db.model("geopoints", geo_points_db_schema_1.default);
}
exports.default = db;


/***/ }),

/***/ "./src/db/mongo/schemas/geo-points.db.schema.ts":
/*!******************************************************!*\
  !*** ./src/db/mongo/schemas/geo-points.db.schema.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose_geojson_schemas_1 = __webpack_require__(/*! mongoose-geojson-schemas */ "mongoose-geojson-schemas");
const GeoPointsSchema = new mongoose_1.Schema({
    geometry: mongoose_geojson_schemas_1.Point
});
exports.default = GeoPointsSchema;


/***/ }),

/***/ "./src/environment.ts":
/*!****************************!*\
  !*** ./src/environment.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const defaultPort = 4000;
exports.environment = {
    apollo: {
        introspection: process.env.APOLLO_INTROSPECTION === 'true',
        playground: process.env.APOLLO_PLAYGROUND === 'true'
    },
    port: process.env.PORT || defaultPort,
    mongo: {
        url: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/graphqldb`
    },
    aadGraphApi: {
        tenant: process.env.AAD_GRAPH_API_TENANT,
        authorityUrl: `${process.env.AAD_GRAPH_API_AUTHORITY_HOST_URL}/${process.env.AAD_GRAPH_API_TENANT}`,
        applicationId: process.env.AAD_GRAPH_API_APPLICATION_ID,
        clientSecret: process.env.AAD_GRAPH_API_CLIENT_SECRET,
        resource: process.env.AAD_GRAPH_API_RESOURCE
    }
};


/***/ }),

/***/ "./src/gql/api/adb2c-graph-photo.api.ts":
/*!**********************************************!*\
  !*** ./src/gql/api/adb2c-graph-photo.api.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const adal_node_1 = __webpack_require__(/*! adal-node */ "adal-node");
const request = __importStar(__webpack_require__(/*! request */ "request"));
const util_1 = __webpack_require__(/*! util */ "util");
const environment_1 = __webpack_require__(/*! ../../environment */ "./src/environment.ts");
const b2cGraphRequest = request.defaults({
    baseUrl: `https://graph.windows.net/${environment_1.environment.aadGraphApi.tenant}`
});
const { get } = b2cGraphRequest;
const [getPm] = [get].map(util_1.promisify);
exports.b2cGraphGetPhoto = (userId) => __awaiter(this, void 0, void 0, function* () {
    const token = yield getToken();
    return yield getPm({
        auth: {
            bearer: token
        },
        encoding: null,
        qs: { 'api-version': 1.6 },
        url: `/users/${userId}/thumbnailPhoto`
    });
});
exports.b2cGraphUploadPhoto = (userId, stream) => __awaiter(this, void 0, void 0, function* () {
    const token = yield getToken();
    const putRequest = b2cGraphRequest.put({
        auth: {
            bearer: token
        },
        qs: { 'api-version': 1.6 },
        url: `/users/${userId}/thumbnailPhoto`,
    });
    stream.pipe(putRequest);
    return new Promise((resolve, reject) => {
        putRequest.on('response', (response) => resolve(response.statusCode));
    });
});
function getToken() {
    return new Promise((resolve, reject) => {
        const authContext = new adal_node_1.AuthenticationContext(environment_1.environment.aadGraphApi.authorityUrl);
        authContext.acquireTokenWithClientCredentials(environment_1.environment.aadGraphApi.resource, environment_1.environment.aadGraphApi.applicationId, environment_1.environment.aadGraphApi.clientSecret, (err, tokenRes) => {
            if (err) {
                reject(err);
            }
            resolve(tokenRes.accessToken);
        });
    });
}


/***/ }),

/***/ "./src/gql/datasources/adb2c-graph.datasource.ts":
/*!*******************************************************!*\
  !*** ./src/gql/datasources/adb2c-graph.datasource.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_datasource_rest_1 = __webpack_require__(/*! apollo-datasource-rest */ "apollo-datasource-rest");
const adal_node_1 = __webpack_require__(/*! adal-node */ "adal-node");
const environment_1 = __webpack_require__(/*! ../../environment */ "./src/environment.ts");
class AdB2cGraphAPI extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
        this.baseURL = `https://graph.windows.net/${environment_1.environment.aadGraphApi.tenant}`;
    }
    willSendRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getToken();
            request.headers.set("Authorization", `Bearer ${token}`);
            request.params.set("api-version", "1.6");
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`/users/${userId}`);
        });
    }
    getToken() {
        return new Promise((resolve, reject) => {
            const authContext = new adal_node_1.AuthenticationContext(environment_1.environment.aadGraphApi.authorityUrl);
            authContext.acquireTokenWithClientCredentials(environment_1.environment.aadGraphApi.resource, environment_1.environment.aadGraphApi.applicationId, environment_1.environment.aadGraphApi.clientSecret, (err, tokenRes) => {
                if (err) {
                    reject(err);
                }
                resolve(tokenRes.accessToken);
            });
        });
    }
}
exports.default = AdB2cGraphAPI;


/***/ }),

/***/ "./src/gql/schemas/adb2c-graph/adb2c-graph-photo.gql.schema.ts":
/*!*********************************************************************!*\
  !*** ./src/gql/schemas/adb2c-graph/adb2c-graph-photo.gql.schema.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_upload_1 = __webpack_require__(/*! graphql-upload */ "graphql-upload");
const adb2c_graph_photo_api_1 = __webpack_require__(/*! ../../api/adb2c-graph-photo.api */ "./src/gql/api/adb2c-graph-photo.api.ts");
exports.schema = [
    `
  scalar Upload

  type Image {
    imageBase64 : String!
  }

  type UploadResult {
    result : String!
  }

  extend type Query {
    userAvatar: Image
  }

  extend type Mutation {
    avatarUpload(file: Upload!): UploadResult
  }

`
];
exports.typeResolvers = {
    Upload: graphql_upload_1.GraphQLUpload
};
exports.queryResolvers = {
    userAvatar: (_, args, { oid }) => __awaiter(this, void 0, void 0, function* () {
        const getPhotoResult = yield adb2c_graph_photo_api_1.b2cGraphGetPhoto(oid);
        const imageFile = getPhotoResult.body;
        const contentType = getPhotoResult.headers["content-type"];
        const bufferBase64 = Buffer.from(imageFile).toString("base64");
        return { imageBase64: `data:${contentType};base64, ${bufferBase64}` };
    })
};
const processUpload = (userId, upload) => __awaiter(this, void 0, void 0, function* () {
    const { createReadStream } = yield upload;
    const stream = createReadStream();
    const b2cGraphUploadPhotoResult = yield adb2c_graph_photo_api_1.b2cGraphUploadPhoto(userId, stream);
    return { result: b2cGraphUploadPhotoResult };
});
exports.mutationResolvers = {
    avatarUpload: (_, { file }, { oid }) => {
        return processUpload(oid, file);
    }
};


/***/ }),

/***/ "./src/gql/schemas/adb2c-graph/adb2c-graph-user.gql.schema.ts":
/*!********************************************************************!*\
  !*** ./src/gql/schemas/adb2c-graph/adb2c-graph-user.gql.schema.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = [
    `
  type User {
    city:  String 
    country: String 
    displayName: String 
    givenName: String
    postalCode: String
    email: String
    preferredLanguage: String
    state : String
    streetAddress: String

  }

  extend type Query {
    user: User
  }

`
];
exports.typeResolvers = {};
exports.queryResolvers = {
    user: (_, args, { oid, dataSources }) => __awaiter(this, void 0, void 0, function* () {
        const getUserResult = yield dataSources.adB2cGraphAPI.getUser(oid);
        const { city, country, displayName, givenName, postalCode, signInNames, preferredLanguage, state, streetAddress, } = getUserResult;
        const email = signInNames[0].value;
        return {
            city,
            country,
            displayName,
            givenName,
            email,
            postalCode,
            preferredLanguage,
            state,
            streetAddress,
        };
    })
};


/***/ }),

/***/ "./src/gql/schemas/executable-schema.ts":
/*!**********************************************!*\
  !*** ./src/gql/schemas/executable-schema.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = __webpack_require__(/*! graphql-tools */ "graphql-tools");
const geo_points_gql_schema_1 = __webpack_require__(/*! ./geo-points/geo-points.gql.schema */ "./src/gql/schemas/geo-points/geo-points.gql.schema.ts");
const adb2c_graph_photo_gql_schema_1 = __webpack_require__(/*! ./adb2c-graph/adb2c-graph-photo.gql.schema */ "./src/gql/schemas/adb2c-graph/adb2c-graph-photo.gql.schema.ts");
const adb2c_graph_user_gql_schema_1 = __webpack_require__(/*! ./adb2c-graph/adb2c-graph-user.gql.schema */ "./src/gql/schemas/adb2c-graph/adb2c-graph-user.gql.schema.ts");
const rootSchema = [
    `
    type Query {
        testMessage: String!
    }

    type Mutation {
      testMessage(name: String): String!
    }

    schema {
      query: Query  
      mutation: Mutation
    }
`
];
const schema = [
    ...rootSchema,
    ...geo_points_gql_schema_1.schema,
    ...adb2c_graph_photo_gql_schema_1.schema,
    ...adb2c_graph_user_gql_schema_1.schema
];
const resolvers = Object.assign({}, geo_points_gql_schema_1.typeResolvers, adb2c_graph_photo_gql_schema_1.typeResolvers, adb2c_graph_user_gql_schema_1.typeResolvers, { Query: Object.assign({ testMessage: () => {
            return "Hello World!";
        } }, geo_points_gql_schema_1.queryResolvers, adb2c_graph_photo_gql_schema_1.queryResolvers, adb2c_graph_user_gql_schema_1.queryResolvers), Mutation: Object.assign({}, adb2c_graph_photo_gql_schema_1.mutationResolvers) });
const executableSchema = graphql_tools_1.makeExecutableSchema({
    typeDefs: schema,
    resolvers
});
exports.default = executableSchema;


/***/ }),

/***/ "./src/gql/schemas/geo-points/custom-scalars.ts":
/*!******************************************************!*\
  !*** ./src/gql/schemas/geo-points/custom-scalars.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = __webpack_require__(/*! graphql */ "graphql");
exports.coordinatesScalarType = new graphql_1.GraphQLScalarType({
    name: 'Coordinates',
    description: 'A set of coordinates. x, y',
    parseValue(value) {
        return value;
    },
    serialize(value) {
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.FLOAT) {
            return ast.value;
        }
        else {
            return null;
        }
    },
});


/***/ }),

/***/ "./src/gql/schemas/geo-points/geo-points.gql.schema.ts":
/*!*************************************************************!*\
  !*** ./src/gql/schemas/geo-points/geo-points.gql.schema.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const custom_scalars_1 = __webpack_require__(/*! ./custom-scalars */ "./src/gql/schemas/geo-points/custom-scalars.ts");
exports.schema = [
    `
    scalar Coordinates

    type PointGeometry {
        type: String!
        coordinates: Coordinates!
      }

      type PointProps {
        id: Int!
        lat: Float
        lon: Float
      }

      type PointObject {
        type: String!
        geometry: PointGeometry
        properties: PointProps
      }

      type FeatureCollection {
        type: String!
        features: [PointObject]
      }

    extend type Query {
     getGeoPointsByCategory: FeatureCollection!
    }    
  `
];
const data = [
    { vehicleid: 1, latitude: 40.1, longitude: -76.5 },
    { vehicleid: 2, latitude: 40.2, longitude: -76.6 },
    { vehicleid: 3, latitude: 40.3, longitude: -76.7 }
];
exports.typeResolvers = {
    Coordinates: custom_scalars_1.coordinatesScalarType,
    PointGeometry: {
        type() {
            return 'Point';
        },
        coordinates(item) {
            return [item.longitude, item.latitude];
        }
    },
    PointProps: {
        id(item) {
            return item.vehicleid;
        },
        lat(item) {
            return item.latitude;
        },
        lon(item) {
            return item.longitude;
        }
    },
    PointObject: {
        type() {
            return 'Feature';
        },
        geometry(item) {
            return item;
        },
        properties(item) {
            return item;
        }
    },
    FeatureCollection: {
        type() {
            return 'FeatureCollection';
        },
        features(data) {
            return data;
        }
    }
};
exports.queryResolvers = {
    getGeoPointsByCategory: () => {
        console.log(data);
        return data;
    }
};


/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(/*! express */ "express");
const morgan = __webpack_require__(/*! morgan */ "morgan");
const cors = __webpack_require__(/*! cors */ "cors");
const passport = __webpack_require__(/*! passport */ "passport");
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const passport_azure_ad_1 = __webpack_require__(/*! passport-azure-ad */ "passport-azure-ad");
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const environment_1 = __webpack_require__(/*! ./environment */ "./src/environment.ts");
const config_1 = __importDefault(__webpack_require__(/*! ./db/mongo/config */ "./src/db/mongo/config.ts"));
const executable_schema_1 = __importDefault(__webpack_require__(/*! ./gql/schemas/executable-schema */ "./src/gql/schemas/executable-schema.ts"));
const adb2c_graph_datasource_1 = __importDefault(__webpack_require__(/*! ./gql/datasources/adb2c-graph.datasource */ "./src/gql/datasources/adb2c-graph.datasource.ts"));
const tenantID = 'wwfsghaltproj.onmicrosoft.com';
const clientID = '6d0235c2-54ec-4436-9a50-7bc68f07c8ba';
const policyName = 'b2c_1_susi_std';
const options = {
    identityMetadata: 'https://wwfsghaltproj.b2clogin.com/' +
        tenantID +
        '/v2.0/.well-known/openid-configuration/',
    clientID: clientID,
    policyName: policyName,
    isB2C: true,
    validateIssuer: true,
    passReqToCallback: false
};
const bearerStrategy = new passport_azure_ad_1.BearerStrategy(options, function (token, done) {
    done(null, {}, token);
});
const app = express();
app.use(morgan('dev'));
app.use(passport.initialize());
passport.use(bearerStrategy);
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use('/api', passport.authenticate('oauth-bearer', { session: false }), function (req, res, next) {
    var claims = req.authInfo;
    req.user = {
        oid: claims.oid,
        emails: claims.emails,
        name: claims.name
    };
    if (claims['scp'].split(' ').indexOf('read') >= 0) {
        next();
    }
    else {
        console.log('Invalid Scope, 403');
        res.status(403).json({ error: 'insufficient_scope' });
    }
});
const server = new apollo_server_express_1.ApolloServer({
    schema: executable_schema_1.default,
    dataSources: () => {
        return {
            adB2cGraphAPI: new adb2c_graph_datasource_1.default(),
        };
    },
    introspection: environment_1.environment.apollo.introspection,
    playground: environment_1.environment.apollo.playground,
    uploads: {
        maxFileSize: 10000 * 1000,
        maxFiles: 20
    },
    context: ({ req }) => {
        return req.user;
    }
});
server.applyMiddleware({ app, path: '/api' });
typeorm_1.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
    config_1.default.once('open', () => {
        app.listen({ port: environment_1.environment.port }, () => console.log(`🚀 Connected to database and Server ready at http://localhost:4000${server.graphqlPath}`));
    });
})).catch(error => console.log(error));
if (true) {
    module.hot.accept();
    module.hot.dispose(() => server.stop());
}


/***/ }),

/***/ 0:
/*!***************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/server.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! /Users/zaziz/Documents/projects/code/apollo-server2-ts/src/server.ts */"./src/server.ts");


/***/ }),

/***/ "adal-node":
/*!****************************!*\
  !*** external "adal-node" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("adal-node");

/***/ }),

/***/ "apollo-datasource-rest":
/*!*****************************************!*\
  !*** external "apollo-datasource-rest" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-datasource-rest");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),

/***/ "graphql-tools":
/*!********************************!*\
  !*** external "graphql-tools" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-tools");

/***/ }),

/***/ "graphql-upload":
/*!*********************************!*\
  !*** external "graphql-upload" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-upload");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "mongoose-geojson-schemas":
/*!*******************************************!*\
  !*** external "mongoose-geojson-schemas" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose-geojson-schemas");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-azure-ad":
/*!************************************!*\
  !*** external "passport-azure-ad" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-azure-ad");

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "typeorm":
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("typeorm");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGIvbW9uZ28vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3NyYy9kYi9tb25nby9zY2hlbWFzL2dlby1wb2ludHMuZGIuc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnZpcm9ubWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL2FwaS9hZGIyYy1ncmFwaC1waG90by5hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dxbC9kYXRhc291cmNlcy9hZGIyYy1ncmFwaC5kYXRhc291cmNlLnRzIiwid2VicGFjazovLy8uL3NyYy9ncWwvc2NoZW1hcy9hZGIyYy1ncmFwaC9hZGIyYy1ncmFwaC1waG90by5ncWwuc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncWwvc2NoZW1hcy9hZGIyYy1ncmFwaC9hZGIyYy1ncmFwaC11c2VyLmdxbC5zY2hlbWEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dxbC9zY2hlbWFzL2V4ZWN1dGFibGUtc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncWwvc2NoZW1hcy9nZW8tcG9pbnRzL2N1c3RvbS1zY2FsYXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9ncWwvc2NoZW1hcy9nZW8tcG9pbnRzL2dlby1wb2ludHMuZ3FsLnNjaGVtYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFkYWwtbm9kZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImdyYXBocWxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncmFwaHFsLXRvb2xzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JhcGhxbC11cGxvYWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb25nb29zZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1vbmdvb3NlLWdlb2pzb24tc2NoZW1hc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1vcmdhblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhc3Nwb3J0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGFzc3BvcnQtYXp1cmUtYWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWZsZWN0LW1ldGFkYXRhXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVxdWVzdFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInR5cGVvcm1cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7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TUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztDQUN6Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hJRCxzQzs7Ozs7Ozs7Ozs7QUNBQSxtRDs7Ozs7Ozs7Ozs7QUNBQSxrRDs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSwyQzs7Ozs7Ozs7Ozs7QUNBQSxxQzs7Ozs7Ozs7Ozs7QUNBQSxxRDs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxxQzs7Ozs7Ozs7Ozs7QUNBQSw4Qzs7Ozs7Ozs7Ozs7QUNBQSw2Qzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxpQyIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIik7XG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rLmlkLCBjaHVuay5tb2R1bGVzKTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkge1xuIFx0XHR0cnkge1xuIFx0XHRcdHZhciB1cGRhdGUgPSByZXF1aXJlKFwiLi9cIiArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiKTtcbiBcdFx0fSBjYXRjaCAoZSkge1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdFx0fVxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZSk7XG4gXHR9XG5cbiBcdC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiMmI2N2JhYWNjMzE2NGZjMzIxNjhcIjtcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdO1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG4gXHRcdFx0XHRcdFx0cmVxdWVzdCArXG4gXHRcdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0KTtcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xuIFx0XHR9O1xuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XG4gXHRcdFx0XHR9LFxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fTtcbiBcdFx0Zm9yICh2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcImVcIiAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJ0XCJcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKSBob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xuIFx0XHRcdFx0dGhyb3cgZXJyO1xuIFx0XHRcdH0pO1xuXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xuIFx0XHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcbiBcdFx0XHRcdFx0aWYgKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdGZuLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRcdGlmIChtb2RlICYgMSkgdmFsdWUgPSBmbih2YWx1ZSk7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18udCh2YWx1ZSwgbW9kZSAmIH4xKTtcbiBcdFx0fTtcbiBcdFx0cmV0dXJuIGZuO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgaG90ID0ge1xuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXG5cbiBcdFx0XHQvLyBNb2R1bGUgQVBJXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB7XG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XG4gXHRcdH1cbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XG4gXHRcdFx0aWYgKCF1cGRhdGUpIHtcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcbiBcdFx0XHR9XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcblxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IFwibWFpblwiO1xuIFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdHtcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJlxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJlxuIFx0XHRcdFx0aG90V2FpdGluZ0ZpbGVzID09PSAwXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcbiBcdFx0XHRyZXR1cm47XG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XG4gXHRcdGZvciAodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZiAoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xuIFx0XHRpZiAoIWRlZmVycmVkKSByZXR1cm47XG4gXHRcdGlmIChob3RBcHBseU9uVXBkYXRlKSB7XG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcbiBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XG4gXHRcdFx0XHR9KVxuIFx0XHRcdFx0LnRoZW4oXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiBcdFx0XHRcdFx0fSxcbiBcdFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdCk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwicmVhZHlcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gXHRcdHZhciBjYjtcbiBcdFx0dmFyIGk7XG4gXHRcdHZhciBqO1xuIFx0XHR2YXIgbW9kdWxlO1xuIFx0XHR2YXIgbW9kdWxlSWQ7XG5cbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XG4gXHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcbiBcdFx0XHRcdFx0aWQ6IGlkXG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmICghbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCkgY29udGludWU7XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdFx0Y29udGludWU7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG5cbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcbiBcdFx0XHR9O1xuIFx0XHR9XG5cbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuIFx0XHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdC8qKiBAdHlwZSB7VE9ET30gKi9cbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHQvKiogQHR5cGUge0Vycm9yfGZhbHNlfSAqL1xuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcbiBcdFx0XHRcdGlmIChyZXN1bHQuY2hhaW4pIHtcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0c3dpdGNoIChyZXN1bHQudHlwZSkge1xuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRcIiBpbiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0LnBhcmVudElkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25VbmFjY2VwdGVkKSBvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkFjY2VwdGVkKSBvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EaXNwb3NlZCkgb3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGFib3J0RXJyb3IpIHtcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0FwcGx5KSB7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRcdFx0XHRpZiAoXG4gXHRcdFx0XHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcyxcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdFx0XHRcdClcbiBcdFx0XHRcdFx0XHQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KFxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF1cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9EaXNwb3NlKSB7XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxuIFx0XHRcdClcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxuIFx0XHRcdFx0fSk7XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdH0pO1xuXG4gXHRcdHZhciBpZHg7XG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xuIFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcblxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XG4gXHRcdFx0XHRjYihkYXRhKTtcbiBcdFx0XHR9XG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcblxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcblxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XG4gXHRcdFx0XHRpZiAoIWNoaWxkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIHtcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xuIFx0XHRcdFx0XHRcdGlmIChpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcblxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXG4gXHRcdGZvciAobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuIFx0XHRcdFx0XHRcdGlmIChjYikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5pbmRleE9mKGNiKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XG4gXHRcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcbiBcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuIFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcbiBcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnIyO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXG4gXHRcdGlmIChlcnJvcikge1xuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiBcdFx0fVxuXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xuXHR2YXIgdW5hY2NlcHRlZE1vZHVsZXMgPSB1cGRhdGVkTW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICghcmVuZXdlZE1vZHVsZXMgfHwgcmVuZXdlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuXHRcdHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGlmICh0eXBlb2YgbW9kdWxlSWQgPT09IFwic3RyaW5nXCIgJiYgbW9kdWxlSWQuaW5kZXhPZihcIiFcIikgIT09IC0xKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IG1vZHVsZUlkLnNwbGl0KFwiIVwiKTtcblx0XHRcdFx0bG9nLmdyb3VwQ29sbGFwc2VkKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgcGFydHMucG9wKCkpO1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHRcdGxvZy5ncm91cEVuZChcImluZm9cIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmFyIG51bWJlcklkcyA9IHJlbmV3ZWRNb2R1bGVzLmV2ZXJ5KGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHRcIltITVJdIENvbnNpZGVyIHVzaW5nIHRoZSBOYW1lZE1vZHVsZXNQbHVnaW4gZm9yIG1vZHVsZSBuYW1lcy5cIlxuXHRcdFx0KTtcblx0fVxufTtcbiIsInZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbmZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuXHR2YXIgc2hvdWxkTG9nID1cblx0XHQobG9nTGV2ZWwgPT09IFwiaW5mb1wiICYmIGxldmVsID09PSBcImluZm9cIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCIsIFwiZXJyb3JcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJlcnJvclwiKTtcblx0cmV0dXJuIHNob3VsZExvZztcbn1cblxuZnVuY3Rpb24gbG9nR3JvdXAobG9nRm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59O1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8qZ2xvYmFscyBfX3Jlc291cmNlUXVlcnkgKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdHZhciBob3RQb2xsSW50ZXJ2YWwgPSArX19yZXNvdXJjZVF1ZXJ5LnN1YnN0cigxKSB8fCAxMCAqIDYwICogMTAwMDtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHR2YXIgY2hlY2tGb3JVcGRhdGUgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZShmcm9tVXBkYXRlKSB7XG5cdFx0aWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiaWRsZVwiKSB7XG5cdFx0XHRtb2R1bGUuaG90XG5cdFx0XHRcdC5jaGVjayh0cnVlKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbih1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdGlmICghdXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRcdGlmIChmcm9tVXBkYXRlKSBsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlIGFwcGxpZWQuXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9sb2ctYXBwbHktcmVzdWx0XCIpKHVwZGF0ZWRNb2R1bGVzLCB1cGRhdGVkTW9kdWxlcyk7XG5cdFx0XHRcdFx0Y2hlY2tGb3JVcGRhdGUodHJ1ZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0XHR2YXIgc3RhdHVzID0gbW9kdWxlLmhvdC5zdGF0dXMoKTtcblx0XHRcdFx0XHRpZiAoW1wiYWJvcnRcIiwgXCJmYWlsXCJdLmluZGV4T2Yoc3RhdHVzKSA+PSAwKSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gQ2Fubm90IGFwcGx5IHVwZGF0ZS5cIik7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gXCIgKyAoZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKSk7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gWW91IG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwbGljYXRpb24hXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsb2coXG5cdFx0XHRcdFx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XHRcdFx0XHRcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdHNldEludGVydmFsKGNoZWNrRm9yVXBkYXRlLCBob3RQb2xsSW50ZXJ2YWwpO1xufSBlbHNlIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiW0hNUl0gSG90IE1vZHVsZSBSZXBsYWNlbWVudCBpcyBkaXNhYmxlZC5cIik7XG59XG4iLCJpbXBvcnQgbW9uZ29vc2UgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gXCIuLi8uLi9lbnZpcm9ubWVudFwiO1xuaW1wb3J0IEdlb1BvaW50c1NjaGVtYSBmcm9tIFwiLi9zY2hlbWFzL2dlby1wb2ludHMuZGIuc2NoZW1hXCI7XG5cbmNvbnN0IG1vbmdvT3B0aW9ucyA9IHtcbiAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuICB1c2VDcmVhdGVJbmRleDogdHJ1ZVxufTtcbmNvbnN0IG1vbmdvZGJVcmkgPSBlbnZpcm9ubWVudC5tb25nby51cmw7XG5tb25nb29zZS5zZXQoXCJkZWJ1Z1wiLCBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpO1xuY29uc3QgZGIgPSBtb25nb29zZS5jcmVhdGVDb25uZWN0aW9uKG1vbmdvZGJVcmksIG1vbmdvT3B0aW9ucyk7XG5cbmRiLm9uKFwiZXJyb3JcIiwgZXJyID0+IHtcbiAgY29uc29sZS53YXJuKGAke2Vycn0sIGRiIGNvbm5lY3Rpb25uIGVycm9yIWAsIHsgbGFiZWw6IFwic3RhcnR1cFwiIH0pO1xufSk7XG5cbmRiLm9uY2UoXCJvcGVuXCIsICgpID0+IHtcbiAgY29uc29sZS5pbmZvKFwiZGIgY29ubmVjdGlvbiBzdWNjZXNzLi4uXCIsIHsgbGFiZWw6IFwic3RhcnR1cFwiIH0pO1xufSk7XG5cbnRyeSB7XG4gIGRiLm1vZGVsKFwiZ2VvcG9pbnRzXCIpO1xufSBjYXRjaCAoZSkge1xuICBkYi5tb2RlbChcImdlb3BvaW50c1wiLCBHZW9Qb2ludHNTY2hlbWEpO1xufVxuZXhwb3J0IGRlZmF1bHQgZGI7XG4iLCJpbXBvcnQgeyBTY2hlbWEgfSBmcm9tICdtb25nb29zZSc7XG5pbXBvcnQgeyBQb2ludCwgR2VvbWV0cnlDb2xsZWN0aW9uIH0gZnJvbSAnbW9uZ29vc2UtZ2VvanNvbi1zY2hlbWFzJztcblxuY29uc3QgR2VvUG9pbnRzU2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gIGdlb21ldHJ5OiBQb2ludFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEdlb1BvaW50c1NjaGVtYTtcbiIsImNvbnN0IGRlZmF1bHRQb3J0ID0gNDAwMDtcblxuaW50ZXJmYWNlIEVudmlyb25tZW50IHtcbiAgYXBvbGxvOiB7XG4gICAgaW50cm9zcGVjdGlvbjogYm9vbGVhbjtcbiAgICBwbGF5Z3JvdW5kOiBib29sZWFuO1xuICB9O1xuICBwb3J0OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgbW9uZ286IHtcbiAgICB1cmw6IHN0cmluZ1xuICB9O1xuXG4gIGFhZEdyYXBoQXBpIDoge1xuICAgIHRlbmFudDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGF1dGhvcml0eVVybDpzdHJpbmcgfCB1bmRlZmluZWQgO1xuICAgIGFwcGxpY2F0aW9uSWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBjbGllbnRTZWNyZXQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICByZXNvdXJjZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBlbnZpcm9ubWVudDogRW52aXJvbm1lbnQgPSB7XG4gIGFwb2xsbzoge1xuICAgIGludHJvc3BlY3Rpb246IHByb2Nlc3MuZW52LkFQT0xMT19JTlRST1NQRUNUSU9OID09PSAndHJ1ZScsXG4gICAgcGxheWdyb3VuZDogcHJvY2Vzcy5lbnYuQVBPTExPX1BMQVlHUk9VTkQgPT09ICd0cnVlJ1xuICB9LFxuICBwb3J0OiBwcm9jZXNzLmVudi5QT1JUIHx8IGRlZmF1bHRQb3J0LFxuXG4gIG1vbmdvOiB7XG4gICAgdXJsOiBgbW9uZ29kYjovLyR7cHJvY2Vzcy5lbnYuTU9OR09fSE9TVH06JHtwcm9jZXNzLmVudi5NT05HT19QT1JUfS9ncmFwaHFsZGJgXG4gIH0sXG4gIGFhZEdyYXBoQXBpIDoge1xuICAgIHRlbmFudDogcHJvY2Vzcy5lbnYuQUFEX0dSQVBIX0FQSV9URU5BTlQsXG4gICAgYXV0aG9yaXR5VXJsOiBgJHtwcm9jZXNzLmVudi5BQURfR1JBUEhfQVBJX0FVVEhPUklUWV9IT1NUX1VSTH0vJHtwcm9jZXNzLmVudi5BQURfR1JBUEhfQVBJX1RFTkFOVH1gLFxuICAgIGFwcGxpY2F0aW9uSWQ6IHByb2Nlc3MuZW52LkFBRF9HUkFQSF9BUElfQVBQTElDQVRJT05fSUQsXG4gICAgY2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5BQURfR1JBUEhfQVBJX0NMSUVOVF9TRUNSRVQsXG4gICAgcmVzb3VyY2U6IHByb2Nlc3MuZW52LkFBRF9HUkFQSF9BUElfUkVTT1VSQ0VcbiAgfVxufTtcbiIsImltcG9ydCB7IEF1dGhlbnRpY2F0aW9uQ29udGV4dCB9IGZyb20gXCJhZGFsLW5vZGVcIjtcblxuaW1wb3J0ICogYXMgcmVxdWVzdCBmcm9tIFwicmVxdWVzdFwiO1xuXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tIFwidXRpbFwiO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vLi4vZW52aXJvbm1lbnRcIjtcblxuXG4vLyBjb25zdCB1c2VySWQgPVwiZjE1ZmY3NTItYzQzMS00MWVkLTgyMDUtODYxZWQxY2E0MzdhXCJcbmNvbnN0IGIyY0dyYXBoUmVxdWVzdCA9IHJlcXVlc3QuZGVmYXVsdHMoe1xuICBiYXNlVXJsOiBgaHR0cHM6Ly9ncmFwaC53aW5kb3dzLm5ldC8ke2Vudmlyb25tZW50LmFhZEdyYXBoQXBpLnRlbmFudH1gXG59KTtcbmNvbnN0IHsgZ2V0IH0gPSBiMmNHcmFwaFJlcXVlc3Q7XG5jb25zdCBbZ2V0UG1dID0gW2dldF0ubWFwKHByb21pc2lmeSk7XG5cbmV4cG9ydCBjb25zdCBiMmNHcmFwaEdldFBob3RvID0gYXN5bmMgKHVzZXJJZDpzdHJpbmcpID0+IHtcbiAgY29uc3QgdG9rZW46IGFueSA9IGF3YWl0IGdldFRva2VuKCk7XG4gIHJldHVybiBhd2FpdCBnZXRQbSh7XG4gICAgYXV0aDoge1xuICAgICAgYmVhcmVyOiB0b2tlblxuICAgIH0sXG4gICAgZW5jb2Rpbmc6IG51bGwsXG4gICAgcXM6IHsnYXBpLXZlcnNpb24nOjEuNn0sXG4gICAgdXJsOiBgL3VzZXJzLyR7dXNlcklkfS90aHVtYm5haWxQaG90b2BcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgYjJjR3JhcGhVcGxvYWRQaG90byA9IGFzeW5jICh1c2VySWQ6c3RyaW5nLHN0cmVhbTogYW55KSA9PiB7XG4gIGNvbnN0IHRva2VuOiBhbnkgPSBhd2FpdCBnZXRUb2tlbigpO1xuXG4gIGNvbnN0IHB1dFJlcXVlc3QgPSBiMmNHcmFwaFJlcXVlc3QucHV0KHtcbiAgICBhdXRoOiB7XG4gICAgICBiZWFyZXI6IHRva2VuXG4gICAgfSxcbiAgICBxczogeydhcGktdmVyc2lvbic6MS42fSxcbiAgICB1cmw6IGAvdXNlcnMvJHt1c2VySWR9L3RodW1ibmFpbFBob3RvYCxcbiAgfSk7XG5cbiAgc3RyZWFtLnBpcGUocHV0UmVxdWVzdCk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBwdXRSZXF1ZXN0Lm9uKCdyZXNwb25zZScsIChyZXNwb25zZTogYW55KSA9PiByZXNvbHZlKHJlc3BvbnNlLnN0YXR1c0NvZGUpKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBnZXRUb2tlbigpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBhdXRoQ29udGV4dCA9IG5ldyBBdXRoZW50aWNhdGlvbkNvbnRleHQoPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5hdXRob3JpdHlVcmwpO1xuICAgIGF1dGhDb250ZXh0LmFjcXVpcmVUb2tlbldpdGhDbGllbnRDcmVkZW50aWFscyhcbiAgICAgIDxzdHJpbmc+ZW52aXJvbm1lbnQuYWFkR3JhcGhBcGkucmVzb3VyY2UsXG4gICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLmFwcGxpY2F0aW9uSWQsXG4gICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLmNsaWVudFNlY3JldCxcbiAgICAgIChlcnI6YW55LCB0b2tlblJlczogYW55KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHRva2VuUmVzLmFjY2Vzc1Rva2VuKTtcbiAgICAgIH1cbiAgICApO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IFJFU1REYXRhU291cmNlLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBBdXRoZW50aWNhdGlvbkNvbnRleHQgfSBmcm9tIFwiYWRhbC1ub2RlXCI7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gXCIuLi8uLi9lbnZpcm9ubWVudFwiO1xuXG5jbGFzcyBBZEIyY0dyYXBoQVBJIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYmFzZVVSTCA9YGh0dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvJHtlbnZpcm9ubWVudC5hYWRHcmFwaEFwaS50ZW5hbnR9YDtcbiAgIFxuICB9XG5cbiAgYXN5bmMgd2lsbFNlbmRSZXF1ZXN0KHJlcXVlc3Q6IFJlcXVlc3RPcHRpb25zKSB7XG4gICAgY29uc3QgdG9rZW46IGFueSA9IGF3YWl0IHRoaXMuZ2V0VG9rZW4oKTtcbiAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLCBgQmVhcmVyICR7dG9rZW59YCk7XG4gICAgcmVxdWVzdC5wYXJhbXMuc2V0KFwiYXBpLXZlcnNpb25cIiwgXCIxLjZcIik7XG4gIH1cblxuICBhc3luYyBnZXRVc2VyKHVzZXJJZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuICBhd2FpdCB0aGlzLmdldChgL3VzZXJzLyR7dXNlcklkfWApOyAgXG4gIH1cblxuICBwcml2YXRlIGdldFRva2VuKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBhdXRoQ29udGV4dCA9IG5ldyBBdXRoZW50aWNhdGlvbkNvbnRleHQoPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5hdXRob3JpdHlVcmwpO1xuICAgICAgYXV0aENvbnRleHQuYWNxdWlyZVRva2VuV2l0aENsaWVudENyZWRlbnRpYWxzKFxuICAgICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLnJlc291cmNlLFxuICAgICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLmFwcGxpY2F0aW9uSWQsXG4gICAgICAgIDxzdHJpbmc+ZW52aXJvbm1lbnQuYWFkR3JhcGhBcGkuY2xpZW50U2VjcmV0LFxuICAgICAgICAoZXJyOmFueSwgdG9rZW5SZXM6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKHRva2VuUmVzLmFjY2Vzc1Rva2VuKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBZEIyY0dyYXBoQVBJO1xuIiwiaW1wb3J0IHsgR3JhcGhRTFVwbG9hZCB9IGZyb20gXCJncmFwaHFsLXVwbG9hZFwiO1xuaW1wb3J0IHsgYjJjR3JhcGhHZXRQaG90bywgYjJjR3JhcGhVcGxvYWRQaG90byB9IGZyb20gXCIuLi8uLi9hcGkvYWRiMmMtZ3JhcGgtcGhvdG8uYXBpXCI7XG5cblxuZXhwb3J0IGNvbnN0IHNjaGVtYSA9IFtcbiAgYFxuICBzY2FsYXIgVXBsb2FkXG5cbiAgdHlwZSBJbWFnZSB7XG4gICAgaW1hZ2VCYXNlNjQgOiBTdHJpbmchXG4gIH1cblxuICB0eXBlIFVwbG9hZFJlc3VsdCB7XG4gICAgcmVzdWx0IDogU3RyaW5nIVxuICB9XG5cbiAgZXh0ZW5kIHR5cGUgUXVlcnkge1xuICAgIHVzZXJBdmF0YXI6IEltYWdlXG4gIH1cblxuICBleHRlbmQgdHlwZSBNdXRhdGlvbiB7XG4gICAgYXZhdGFyVXBsb2FkKGZpbGU6IFVwbG9hZCEpOiBVcGxvYWRSZXN1bHRcbiAgfVxuXG5gXG5dO1xuXG5leHBvcnQgY29uc3QgdHlwZVJlc29sdmVycyA9IHtcbiAgVXBsb2FkOiBHcmFwaFFMVXBsb2FkXG59O1xuZXhwb3J0IGNvbnN0IHF1ZXJ5UmVzb2x2ZXJzID0ge1xuICB1c2VyQXZhdGFyOiBhc3luYyAoXzogYW55LCBhcmdzOiBhbnksIHsgb2lkIH06IGFueSkgPT4ge1xuICAgIGNvbnN0IGdldFBob3RvUmVzdWx0ID0gYXdhaXQgYjJjR3JhcGhHZXRQaG90byhvaWQpO1xuICAgIGNvbnN0IGltYWdlRmlsZSA9IGdldFBob3RvUmVzdWx0LmJvZHk7XG4gICAgY29uc3QgY29udGVudFR5cGUgPSBnZXRQaG90b1Jlc3VsdC5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdO1xuICAgIGNvbnN0IGJ1ZmZlckJhc2U2NCA9IEJ1ZmZlci5mcm9tKGltYWdlRmlsZSkudG9TdHJpbmcoXCJiYXNlNjRcIik7XG4gICAgcmV0dXJuIHsgaW1hZ2VCYXNlNjQ6IGBkYXRhOiR7Y29udGVudFR5cGV9O2Jhc2U2NCwgJHtidWZmZXJCYXNlNjR9YCB9O1xuICB9XG59O1xuXG5jb25zdCBwcm9jZXNzVXBsb2FkID0gYXN5bmMgKHVzZXJJZDogc3RyaW5nLCB1cGxvYWQ6IGFueSkgPT4ge1xuICBjb25zdCB7IGNyZWF0ZVJlYWRTdHJlYW0gfSA9IGF3YWl0IHVwbG9hZDtcbiAgY29uc3Qgc3RyZWFtID0gY3JlYXRlUmVhZFN0cmVhbSgpO1xuICBjb25zdCBiMmNHcmFwaFVwbG9hZFBob3RvUmVzdWx0ID0gYXdhaXQgYjJjR3JhcGhVcGxvYWRQaG90byh1c2VySWQsIHN0cmVhbSk7XG4gIHJldHVybiB7IHJlc3VsdDogYjJjR3JhcGhVcGxvYWRQaG90b1Jlc3VsdCB9O1xufTtcblxuZXhwb3J0IGNvbnN0IG11dGF0aW9uUmVzb2x2ZXJzID0ge1xuICBhdmF0YXJVcGxvYWQ6IChfOiBhbnksIHsgZmlsZSB9OiBhbnksIHsgb2lkIH06IGFueSkgPT4ge1xuICAgIHJldHVybiBwcm9jZXNzVXBsb2FkKG9pZCwgZmlsZSk7XG4gIH1cbn07XG4iLCJleHBvcnQgY29uc3Qgc2NoZW1hID0gW1xuICBgXG4gIHR5cGUgVXNlciB7XG4gICAgY2l0eTogIFN0cmluZyBcbiAgICBjb3VudHJ5OiBTdHJpbmcgXG4gICAgZGlzcGxheU5hbWU6IFN0cmluZyBcbiAgICBnaXZlbk5hbWU6IFN0cmluZ1xuICAgIHBvc3RhbENvZGU6IFN0cmluZ1xuICAgIGVtYWlsOiBTdHJpbmdcbiAgICBwcmVmZXJyZWRMYW5ndWFnZTogU3RyaW5nXG4gICAgc3RhdGUgOiBTdHJpbmdcbiAgICBzdHJlZXRBZGRyZXNzOiBTdHJpbmdcblxuICB9XG5cbiAgZXh0ZW5kIHR5cGUgUXVlcnkge1xuICAgIHVzZXI6IFVzZXJcbiAgfVxuXG5gXG5dO1xuZXhwb3J0IGNvbnN0IHR5cGVSZXNvbHZlcnMgPSB7fTtcbmV4cG9ydCBjb25zdCBxdWVyeVJlc29sdmVycyA9IHtcbiAgdXNlcjogYXN5bmMgKF86IGFueSwgYXJnczogYW55LCB7IG9pZCwgZGF0YVNvdXJjZXMgfTogYW55KSA9PiB7XG4gICAgY29uc3QgZ2V0VXNlclJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VzLmFkQjJjR3JhcGhBUEkuZ2V0VXNlcihvaWQpO1xuICAgIFxuXG4gICAgY29uc3Qge1xuICAgICAgY2l0eSxcbiAgICAgIGNvdW50cnksXG4gICAgICBkaXNwbGF5TmFtZSxcbiAgICAgIGdpdmVuTmFtZSxcbiAgICAgIHBvc3RhbENvZGUsXG4gICAgICBzaWduSW5OYW1lcyxcbiAgICAgIHByZWZlcnJlZExhbmd1YWdlLFxuICAgICAgc3RhdGUsXG4gICAgICBzdHJlZXRBZGRyZXNzLFxuICAgIH0gPSBnZXRVc2VyUmVzdWx0O1xuXG4gICAgY29uc3QgZW1haWwgPSBzaWduSW5OYW1lc1swXS52YWx1ZVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNpdHksXG4gICAgICBjb3VudHJ5LFxuICAgICAgZGlzcGxheU5hbWUsXG4gICAgICBnaXZlbk5hbWUsXG4gICAgICBlbWFpbCxcbiAgICAgIHBvc3RhbENvZGUsXG4gICAgICBwcmVmZXJyZWRMYW5ndWFnZSxcbiAgICAgIHN0YXRlLFxuICAgICAgc3RyZWV0QWRkcmVzcyxcbiAgICB9O1xuICB9XG59O1xuIiwiaW1wb3J0IHsgbWFrZUV4ZWN1dGFibGVTY2hlbWEgfSBmcm9tIFwiZ3JhcGhxbC10b29sc1wiO1xuaW1wb3J0IHtcbiAgc2NoZW1hIGFzIEdlb1BvaW50c1NjaGVtYSxcbiAgdHlwZVJlc29sdmVycyBhcyBHZW9Qb2ludHNUeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBHZW9Qb2ludHNRdWVyeVJlc29sdmVyc1xufSBmcm9tIFwiLi9nZW8tcG9pbnRzL2dlby1wb2ludHMuZ3FsLnNjaGVtYVwiO1xuaW1wb3J0IHtcbiAgc2NoZW1hIGFzIEFkYjJjR3JhcGhQaG90b1NjaGVtYSxcbiAgdHlwZVJlc29sdmVycyBhcyBBZGIyY0dyYXBoUGhvdG9UeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBBZGIyY0dyYXBoUGhvdG9RdWVyeVJlc29sdmVycyxcbiAgbXV0YXRpb25SZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFBob3RvTXV0YXRpb25SZXNvbHZlcnNcbn0gZnJvbSBcIi4vYWRiMmMtZ3JhcGgvYWRiMmMtZ3JhcGgtcGhvdG8uZ3FsLnNjaGVtYVwiO1xuXG5pbXBvcnQge1xuICBzY2hlbWEgYXMgQWRiMmNHcmFwaFVzZXJTY2hlbWEsXG4gIHR5cGVSZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFVzZXJUeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBBZGIyY0dyYXBoVXNlclF1ZXJ5UmVzb2x2ZXJzXG59IGZyb20gXCIuL2FkYjJjLWdyYXBoL2FkYjJjLWdyYXBoLXVzZXIuZ3FsLnNjaGVtYVwiO1xuXG5jb25zdCByb290U2NoZW1hID0gW1xuICBgXG4gICAgdHlwZSBRdWVyeSB7XG4gICAgICAgIHRlc3RNZXNzYWdlOiBTdHJpbmchXG4gICAgfVxuXG4gICAgdHlwZSBNdXRhdGlvbiB7XG4gICAgICB0ZXN0TWVzc2FnZShuYW1lOiBTdHJpbmcpOiBTdHJpbmchXG4gICAgfVxuXG4gICAgc2NoZW1hIHtcbiAgICAgIHF1ZXJ5OiBRdWVyeSAgXG4gICAgICBtdXRhdGlvbjogTXV0YXRpb25cbiAgICB9XG5gXG5dO1xuY29uc3Qgc2NoZW1hID0gW1xuICAuLi5yb290U2NoZW1hLFxuICAuLi5HZW9Qb2ludHNTY2hlbWEsXG4gIC4uLkFkYjJjR3JhcGhQaG90b1NjaGVtYSxcbiAgLi4uQWRiMmNHcmFwaFVzZXJTY2hlbWFcbl07XG5cbmNvbnN0IHJlc29sdmVycyA9IHtcbiAgLi4uR2VvUG9pbnRzVHlwZVJlc29sdmVycyxcbiAgLi4uQWRiMmNHcmFwaFBob3RvVHlwZVJlc29sdmVycyxcbiAgLi4uQWRiMmNHcmFwaFVzZXJUeXBlUmVzb2x2ZXJzLFxuXG4gIFF1ZXJ5OiB7XG4gICAgdGVzdE1lc3NhZ2U6ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgcmV0dXJuIFwiSGVsbG8gV29ybGQhXCI7XG4gICAgfSxcbiAgICAuLi5HZW9Qb2ludHNRdWVyeVJlc29sdmVycyxcbiAgICAuLi5BZGIyY0dyYXBoUGhvdG9RdWVyeVJlc29sdmVycyxcbiAgICAuLi5BZGIyY0dyYXBoVXNlclF1ZXJ5UmVzb2x2ZXJzXG4gIH0sXG5cbiAgTXV0YXRpb246IHtcbiAgICAuLi5BZGIyY0dyYXBoUGhvdG9NdXRhdGlvblJlc29sdmVyc1xuICB9XG59O1xuXG5jb25zdCBleGVjdXRhYmxlU2NoZW1hID0gbWFrZUV4ZWN1dGFibGVTY2hlbWEoe1xuICB0eXBlRGVmczogc2NoZW1hLFxuICByZXNvbHZlcnNcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBleGVjdXRhYmxlU2NoZW1hO1xuIiwiaW1wb3J0IHsgR3JhcGhRTFNjYWxhclR5cGUsIEtpbmQgfSBmcm9tICdncmFwaHFsJztcblxuZXhwb3J0IGNvbnN0IGNvb3JkaW5hdGVzU2NhbGFyVHlwZSA9IG5ldyBHcmFwaFFMU2NhbGFyVHlwZSh7XG4gICAgbmFtZTogJ0Nvb3JkaW5hdGVzJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Egc2V0IG9mIGNvb3JkaW5hdGVzLiB4LCB5JyxcbiAgICBwYXJzZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIHNlcmlhbGl6ZSh2YWx1ZSA6IGFueSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gICAgcGFyc2VMaXRlcmFsKGFzdCkge1xuICAgICAgaWYoYXN0LmtpbmQgPT09IEtpbmQuRkxPQVQpe1xuICAgICAgICByZXR1cm4gYXN0LnZhbHVlO1xuICAgICAgfWVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICBcbiAgICB9LFxuICB9KSIsImltcG9ydCB7IGNvb3JkaW5hdGVzU2NhbGFyVHlwZSB9IGZyb20gJy4vY3VzdG9tLXNjYWxhcnMnO1xuXG5leHBvcnQgY29uc3Qgc2NoZW1hID0gW1xuICBgXG4gICAgc2NhbGFyIENvb3JkaW5hdGVzXG5cbiAgICB0eXBlIFBvaW50R2VvbWV0cnkge1xuICAgICAgICB0eXBlOiBTdHJpbmchXG4gICAgICAgIGNvb3JkaW5hdGVzOiBDb29yZGluYXRlcyFcbiAgICAgIH1cblxuICAgICAgdHlwZSBQb2ludFByb3BzIHtcbiAgICAgICAgaWQ6IEludCFcbiAgICAgICAgbGF0OiBGbG9hdFxuICAgICAgICBsb246IEZsb2F0XG4gICAgICB9XG5cbiAgICAgIHR5cGUgUG9pbnRPYmplY3Qge1xuICAgICAgICB0eXBlOiBTdHJpbmchXG4gICAgICAgIGdlb21ldHJ5OiBQb2ludEdlb21ldHJ5XG4gICAgICAgIHByb3BlcnRpZXM6IFBvaW50UHJvcHNcbiAgICAgIH1cblxuICAgICAgdHlwZSBGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyFcbiAgICAgICAgZmVhdHVyZXM6IFtQb2ludE9iamVjdF1cbiAgICAgIH1cblxuICAgIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICAgZ2V0R2VvUG9pbnRzQnlDYXRlZ29yeTogRmVhdHVyZUNvbGxlY3Rpb24hXG4gICAgfSAgICBcbiAgYFxuXTtcblxuY29uc3QgZGF0YSA9IFtcbiAgeyB2ZWhpY2xlaWQ6IDEsIGxhdGl0dWRlOiA0MC4xLCBsb25naXR1ZGU6IC03Ni41IH0sXG4gIHsgdmVoaWNsZWlkOiAyLCBsYXRpdHVkZTogNDAuMiwgbG9uZ2l0dWRlOiAtNzYuNiB9LFxuICB7IHZlaGljbGVpZDogMywgbGF0aXR1ZGU6IDQwLjMsIGxvbmdpdHVkZTogLTc2LjcgfVxuXTtcblxuZXhwb3J0IGNvbnN0IHR5cGVSZXNvbHZlcnMgPSB7XG4gIENvb3JkaW5hdGVzOiBjb29yZGluYXRlc1NjYWxhclR5cGUsXG4gIFBvaW50R2VvbWV0cnk6IHtcbiAgICB0eXBlKCkge1xuICAgICAgcmV0dXJuICdQb2ludCc7XG4gICAgfSxcbiAgICBjb29yZGluYXRlcyhpdGVtOiB7IGxvbmdpdHVkZTogYW55OyBsYXRpdHVkZTogYW55IH0pIHtcbiAgICAgIHJldHVybiBbaXRlbS5sb25naXR1ZGUsIGl0ZW0ubGF0aXR1ZGVdO1xuICAgIH1cbiAgfSxcbiAgUG9pbnRQcm9wczoge1xuICAgIGlkKGl0ZW06IHsgdmVoaWNsZWlkOiBhbnkgfSkge1xuICAgICAgcmV0dXJuIGl0ZW0udmVoaWNsZWlkO1xuICAgIH0sXG4gICAgbGF0KGl0ZW06IHsgbGF0aXR1ZGU6IGFueSB9KSB7XG4gICAgICByZXR1cm4gaXRlbS5sYXRpdHVkZTtcbiAgICB9LFxuICAgIGxvbihpdGVtOiB7IGxvbmdpdHVkZTogYW55IH0pIHtcbiAgICAgIHJldHVybiBpdGVtLmxvbmdpdHVkZTtcbiAgICB9XG4gIH0sXG4gIFBvaW50T2JqZWN0OiB7XG4gICAgdHlwZSgpIHtcbiAgICAgIHJldHVybiAnRmVhdHVyZSc7XG4gICAgfSxcbiAgICBnZW9tZXRyeShpdGVtOiBhbnkpIHtcbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0sXG4gICAgcHJvcGVydGllcyhpdGVtOiBhbnkpIHtcbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfSxcbiAgRmVhdHVyZUNvbGxlY3Rpb246IHtcbiAgICB0eXBlKCkge1xuICAgICAgcmV0dXJuICdGZWF0dXJlQ29sbGVjdGlvbic7XG4gICAgfSxcbiAgICBmZWF0dXJlcyhkYXRhOiBhbnkpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHF1ZXJ5UmVzb2x2ZXJzID0ge1xuICBnZXRHZW9Qb2ludHNCeUNhdGVnb3J5OiAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coZGF0YSlcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufTtcbiIsImltcG9ydCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuaW1wb3J0IG1vcmdhbiA9IHJlcXVpcmUoJ21vcmdhbicpO1xuaW1wb3J0IGNvcnMgPSByZXF1aXJlKCdjb3JzJyk7XG5pbXBvcnQgcGFzc3BvcnQgPSByZXF1aXJlKCdwYXNzcG9ydCcpO1xuaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiO1xuaW1wb3J0IHtjcmVhdGVDb25uZWN0aW9ufSBmcm9tIFwidHlwZW9ybVwiO1xuLy8gaW1wb3J0IHtVc2VyfSBmcm9tIFwiLi9lbnRpdHkvVXNlclwiO1xuaW1wb3J0IHsgQmVhcmVyU3RyYXRlZ3kgfSBmcm9tICdwYXNzcG9ydC1henVyZS1hZCc7XG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIgfSBmcm9tICdhcG9sbG8tc2VydmVyLWV4cHJlc3MnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCBkYiBmcm9tICcuL2RiL21vbmdvL2NvbmZpZyc7XG5pbXBvcnQgZXhlY3V0YWJsZVNjaGVtYSBmcm9tICcuL2dxbC9zY2hlbWFzL2V4ZWN1dGFibGUtc2NoZW1hJztcbmltcG9ydCBBZEIyY0dyYXBoQVBJIGZyb20gJy4vZ3FsL2RhdGFzb3VyY2VzL2FkYjJjLWdyYXBoLmRhdGFzb3VyY2UnO1xuXG5cblxuY29uc3QgdGVuYW50SUQgPSAnd3dmc2doYWx0cHJvai5vbm1pY3Jvc29mdC5jb20nO1xuY29uc3QgY2xpZW50SUQgPSAnNmQwMjM1YzItNTRlYy00NDM2LTlhNTAtN2JjNjhmMDdjOGJhJztcbmNvbnN0IHBvbGljeU5hbWUgPSAnYjJjXzFfc3VzaV9zdGQnO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBpZGVudGl0eU1ldGFkYXRhOlxuICAgICdodHRwczovL3d3ZnNnaGFsdHByb2ouYjJjbG9naW4uY29tLycgK1xuICAgIHRlbmFudElEICtcbiAgICAnL3YyLjAvLndlbGwta25vd24vb3BlbmlkLWNvbmZpZ3VyYXRpb24vJyxcbiAgY2xpZW50SUQ6IGNsaWVudElELFxuICBwb2xpY3lOYW1lOiBwb2xpY3lOYW1lLFxuICBpc0IyQzogdHJ1ZSxcbiAgdmFsaWRhdGVJc3N1ZXI6IHRydWUsXG4gIHBhc3NSZXFUb0NhbGxiYWNrOiBmYWxzZVxufTtcblxuY29uc3QgYmVhcmVyU3RyYXRlZ3kgPSBuZXcgQmVhcmVyU3RyYXRlZ3kob3B0aW9ucywgZnVuY3Rpb24odG9rZW4sIGRvbmUpIHtcbiAgLy8gY29uc29sZS5sb2codG9rZW4pO1xuICAvLyBTZW5kIHVzZXIgaW5mbyB1c2luZyB0aGUgc2Vjb25kIGFyZ3VtZW50XG4gIGRvbmUobnVsbCwge30sIHRva2VuKTtcbn0pO1xuXG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbmFwcC51c2UobW9yZ2FuKCdkZXYnKSk7XG5cbmFwcC51c2UocGFzc3BvcnQuaW5pdGlhbGl6ZSgpKTtcbnBhc3Nwb3J0LnVzZShiZWFyZXJTdHJhdGVneSk7XG5cblxuYXBwLnVzZShjb3JzKHtjcmVkZW50aWFsczogdHJ1ZSwgb3JpZ2luOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJ30pKTtcbmFwcC51c2UoXG4gICcvYXBpJyxcbiAgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdvYXV0aC1iZWFyZXInLCB7IHNlc3Npb246IGZhbHNlIH0pLFxuICBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjbGFpbXMgPSByZXEuYXV0aEluZm87XG4gICAgcmVxLnVzZXIgPSB7XG4gICAgICBvaWQgOiBjbGFpbXMub2lkLFxuICAgICAgZW1haWxzOiBjbGFpbXMuZW1haWxzLFxuICAgICAgbmFtZTogY2xhaW1zLm5hbWVcbiAgICB9XG4gICAgaWYgKGNsYWltc1snc2NwJ10uc3BsaXQoJyAnKS5pbmRleE9mKCdyZWFkJykgPj0gMCkge1xuICAgICAgbmV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnSW52YWxpZCBTY29wZSwgNDAzJyk7XG4gICAgICByZXMuc3RhdHVzKDQwMykuanNvbih7IGVycm9yOiAnaW5zdWZmaWNpZW50X3Njb3BlJyB9KTtcbiAgICB9XG4gIH1cbik7XG5cblxuXG5jb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHtcbiAgc2NoZW1hOiBleGVjdXRhYmxlU2NoZW1hLFxuICBkYXRhU291cmNlczogKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBhZEIyY0dyYXBoQVBJOiBuZXcgQWRCMmNHcmFwaEFQSSgpLFxuICAgIH07XG4gIH0sXG4gIGludHJvc3BlY3Rpb246IGVudmlyb25tZW50LmFwb2xsby5pbnRyb3NwZWN0aW9uLFxuICBwbGF5Z3JvdW5kOiBlbnZpcm9ubWVudC5hcG9sbG8ucGxheWdyb3VuZCxcbiAgdXBsb2Fkczoge1xuICAgIC8vIExpbWl0cyBoZXJlIHNob3VsZCBiZSBzdHJpY3RlciB0aGFuIGNvbmZpZyBmb3Igc3Vycm91bmRpbmdcbiAgICAvLyBpbmZyYXN0cnVjdHVyZSBzdWNoIGFzIE5naW54IHNvIGVycm9ycyBjYW4gYmUgaGFuZGxlZCBlbGVnYW50bHkgYnlcbiAgICAvLyBncmFwaHFsLXVwbG9hZDpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vamF5ZGVuc2VyaWMvZ3JhcGhxbC11cGxvYWQjdHlwZS11cGxvYWRvcHRpb25zXG4gICAgbWF4RmlsZVNpemU6IDEwMDAwICogMTAwMCwgLy8gMTAgTUJcbiAgICBtYXhGaWxlczogMjBcbiAgfSxcbiAgY29udGV4dDogICh7IHJlcSB9KSA9PiB7XG5cbiAgICByZXR1cm4gcmVxLnVzZXI7XG4gIH1cbn0pO1xuXG5cbnNlcnZlci5hcHBseU1pZGRsZXdhcmUoeyBhcHAsIHBhdGg6ICcvYXBpJyB9KTsgLy8gYXBwIGlzIGZyb20gYW4gZXhpc3RpbmcgZXhwcmVzcyBhcHBcblxuY3JlYXRlQ29ubmVjdGlvbigpLnRoZW4oYXN5bmMgY29ubmVjdGlvbiA9PiB7XG5cbiAgZGIub25jZSgnb3BlbicsICgpID0+IHtcbiAgICBhcHAubGlzdGVuKHsgcG9ydDogZW52aXJvbm1lbnQucG9ydCB9LCAoKSA9PlxuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGDwn5qAIENvbm5lY3RlZCB0byBkYXRhYmFzZSBhbmQgU2VydmVyIHJlYWR5IGF0IGh0dHA6Ly9sb2NhbGhvc3Q6NDAwMCR7XG4gICAgICAgICAgc2VydmVyLmdyYXBocWxQYXRoXG4gICAgICAgIH1gXG4gICAgICApXG4gICAgKTtcbiAgfSk7XG5cbiAgLy8gY29uc29sZS5sb2coXCJJbnNlcnRpbmcgYSBuZXcgdXNlciBpbnRvIHRoZSBkYXRhYmFzZS4uLlwiKTtcbiAgLy8gY29uc3QgdXNlciA9IG5ldyBVc2VyKCk7XG4gIC8vIHVzZXIuZmlyc3ROYW1lID0gXCJUaW1iZXJcIjtcbiAgLy8gdXNlci5sYXN0TmFtZSA9IFwiU2F3XCI7XG4gIC8vIHVzZXIuYWdlID0gMjU7XG4gIC8vIGF3YWl0IGNvbm5lY3Rpb24ubWFuYWdlci5zYXZlKHVzZXIpO1xuICAvLyBjb25zb2xlLmxvZyhcIlNhdmVkIGEgbmV3IHVzZXIgd2l0aCBpZDogXCIgKyB1c2VyLmlkKTtcblxuICAvLyBjb25zb2xlLmxvZyhcIkxvYWRpbmcgdXNlcnMgZnJvbSB0aGUgZGF0YWJhc2UuLi5cIik7XG4gIC8vIGNvbnN0IHVzZXJzID0gYXdhaXQgY29ubmVjdGlvbi5tYW5hZ2VyLmZpbmQoVXNlcik7XG4gIC8vIGNvbnNvbGUubG9nKFwiTG9hZGVkIHVzZXJzOiBcIiwgdXNlcnMpO1xuXG4gIC8vIGNvbnNvbGUubG9nKFwiSGVyZSB5b3UgY2FuIHNldHVwIGFuZCBydW4gZXhwcmVzcy9rb2EvYW55IG90aGVyIGZyYW1ld29yay5cIik7XG5cbn0pLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG5cblxuXG5cbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gIG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiBzZXJ2ZXIuc3RvcCgpKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFkYWwtbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsLXRvb2xzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtdXBsb2FkXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvb3NlLWdlb2pzb24tc2NoZW1hc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb3JnYW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGFzc3BvcnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGFzc3BvcnQtYXp1cmUtYWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVmbGVjdC1tZXRhZGF0YVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZXF1ZXN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR5cGVvcm1cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9