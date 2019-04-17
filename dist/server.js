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
/******/ 	var hotCurrentHash = "73ada476bd136150e19c";
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

/***/ "./src/db/mssql/entity/User.ts":
/*!*************************************!*\
  !*** ./src/db/mssql/entity/User.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;


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
/* WEBPACK VAR INJECTION */(function(__dirname) {
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
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const express = __webpack_require__(/*! express */ "express");
const morgan = __webpack_require__(/*! morgan */ "morgan");
const cors = __webpack_require__(/*! cors */ "cors");
const passport = __webpack_require__(/*! passport */ "passport");
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const passport_azure_ad_1 = __webpack_require__(/*! passport-azure-ad */ "passport-azure-ad");
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const environment_1 = __webpack_require__(/*! ./environment */ "./src/environment.ts");
const config_1 = __importDefault(__webpack_require__(/*! ./db/mongo/config */ "./src/db/mongo/config.ts"));
const executable_schema_1 = __importDefault(__webpack_require__(/*! ./gql/schemas/executable-schema */ "./src/gql/schemas/executable-schema.ts"));
const adb2c_graph_datasource_1 = __importDefault(__webpack_require__(/*! ./gql/datasources/adb2c-graph.datasource */ "./src/gql/datasources/adb2c-graph.datasource.ts"));
const User_1 = __webpack_require__(/*! ./db/mssql/entity/User */ "./src/db/mssql/entity/User.ts");
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
            adB2cGraphAPI: new adb2c_graph_datasource_1.default()
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
console.log(__dirname);
typeorm_1.createConnection({
    "type": "mssql",
    "host": "haltappdb.database.windows.net",
    "username": "halltapp_db_admin",
    "password": "P@ssword",
    "database": "haltappdevdb",
    "synchronize": true,
    "logging": false,
    "options": {
        "encrypt": true
    },
    "entities": [User_1.User]
})
    .then((connection) => __awaiter(this, void 0, void 0, function* () {
    config_1.default.once('open', () => {
        app.listen({ port: environment_1.environment.port }, () => console.log(`🚀 Connected to database and Server ready at http://localhost:4000${server.graphqlPath}`));
    });
    console.log('Inserting a new user into the database...');
    const user = new User_1.User();
    user.firstName = 'Timber';
    user.lastName = 'Saw';
    user.age = 25;
    yield connection.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);
    console.log('Loading users from the database...');
    const users = yield connection.manager.find(User_1.User);
    console.log('Loaded users: ', users);
}))
    .catch(error => console.log(error));
if (true) {
    module.hot.accept();
    module.hot.dispose(() => server.stop());
}

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ 0:
/*!***************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/server.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! /Users/zain/Documents/Code/apollo-server2-ts/src/server.ts */"./src/server.ts");


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGIvbW9uZ28vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3NyYy9kYi9tb25nby9zY2hlbWFzL2dlby1wb2ludHMuZGIuc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9kYi9tc3NxbC9lbnRpdHkvVXNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW52aXJvbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dxbC9hcGkvYWRiMmMtZ3JhcGgtcGhvdG8uYXBpLnRzIiwid2VicGFjazovLy8uL3NyYy9ncWwvZGF0YXNvdXJjZXMvYWRiMmMtZ3JhcGguZGF0YXNvdXJjZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL3NjaGVtYXMvYWRiMmMtZ3JhcGgvYWRiMmMtZ3JhcGgtcGhvdG8uZ3FsLnNjaGVtYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL3NjaGVtYXMvYWRiMmMtZ3JhcGgvYWRiMmMtZ3JhcGgtdXNlci5ncWwuc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncWwvc2NoZW1hcy9leGVjdXRhYmxlLXNjaGVtYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL3NjaGVtYXMvZ2VvLXBvaW50cy9jdXN0b20tc2NhbGFycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL3NjaGVtYXMvZ2VvLXBvaW50cy9nZW8tcG9pbnRzLmdxbC5zY2hlbWEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhZGFsLW5vZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncmFwaHFsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JhcGhxbC10b29sc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImdyYXBocWwtdXBsb2FkXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb25nb29zZS1nZW9qc29uLXNjaGVtYXNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXNzcG9ydFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhc3Nwb3J0LWF6dXJlLWFkXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVmbGVjdC1tZXRhZGF0YVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlcXVlc3RcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0eXBlb3JtXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXRpbFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2QkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQWtCLDhCQUE4QjtBQUNoRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsMkJBQTJCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUFtQixjQUFjO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsS0FBSztBQUNyQjtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHVCQUFlLDRCQUE0QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHVCQUFlLDRCQUE0QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQWlCLHVDQUF1QztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBR3ZDLENBQUMsRUFBQztLQUNELEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUV0QyxJQUFJLElBQVUsRUFBRTtJQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Q0FDekM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcElELHNDOzs7Ozs7Ozs7OztBQ0FBLG1EOzs7Ozs7Ozs7OztBQ0FBLGtEOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLDJDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLHFEOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLDhDOzs7Ozs7Ozs7OztBQ0FBLDZDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLGlDIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBjaHVuayA9IHJlcXVpcmUoXCIuL1wiICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmsuaWQsIGNodW5rLm1vZHVsZXMpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7XG4gXHRcdHRyeSB7XG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpO1xuIFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuIFx0XHR9XG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodXBkYXRlKTtcbiBcdH1cblxuIFx0Ly9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI3M2FkYTQ3NmJkMTM2MTUwZTE5Y1wiO1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcInRcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0Zm4udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdFx0aWYgKG1vZGUgJiAxKSB2YWx1ZSA9IGZuKHZhbHVlKTtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy50KHZhbHVlLCBtb2RlICYgfjEpO1xuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0fVxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gXCJtYWluXCI7XG4gXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvbmUtYmxvY2tzXG4gXHRcdFx0e1xuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xuIFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG4gXHRcdFx0KTtcbiBcdFx0fTtcblxuIFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xuIFx0XHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuIFx0XHRcdFx0dmFyIHJlc3VsdDtcbiBcdFx0XHRcdGlmIChob3RVcGRhdGVbaWRdKSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0KVxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoY2IpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdHJldHVybiByZW5ld2VkTW9kdWxlcyAmJiByZW5ld2VkTW9kdWxlcy5pbmRleE9mKG1vZHVsZUlkKSA8IDA7XG5cdH0pO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdGlmICh1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0bG9nKFxuXHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcIltITVJdIFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBjb3VsZG4ndCBiZSBob3QgdXBkYXRlZDogKFRoZXkgd291bGQgbmVlZCBhIGZ1bGwgcmVsb2FkISlcIlxuXHRcdCk7XG5cdFx0dW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XG5cdH0gZWxzZSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZWQgbW9kdWxlczpcIik7XG5cdFx0cmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgbW9kdWxlSWQgPT09IFwibnVtYmVyXCI7XG5cdFx0fSk7XG5cdFx0aWYgKG51bWJlcklkcylcblx0XHRcdGxvZyhcblx0XHRcdFx0XCJpbmZvXCIsXG5cdFx0XHRcdFwiW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIE5hbWVkTW9kdWxlc1BsdWdpbiBmb3IgbW9kdWxlIG5hbWVzLlwiXG5cdFx0XHQpO1xuXHR9XG59O1xuIiwidmFyIGxvZ0xldmVsID0gXCJpbmZvXCI7XG5cbmZ1bmN0aW9uIGR1bW15KCkge31cblxuZnVuY3Rpb24gc2hvdWxkTG9nKGxldmVsKSB7XG5cdHZhciBzaG91bGRMb2cgPVxuXHRcdChsb2dMZXZlbCA9PT0gXCJpbmZvXCIgJiYgbGV2ZWwgPT09IFwiaW5mb1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcImVycm9yXCIpO1xuXHRyZXR1cm4gc2hvdWxkTG9nO1xufVxuXG5mdW5jdGlvbiBsb2dHcm91cChsb2dGbikge1xuXHRyZXR1cm4gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0aWYgKGxldmVsID09PSBcImluZm9cIikge1xuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcIndhcm5pbmdcIikge1xuXHRcdFx0Y29uc29sZS53YXJuKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZyk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cbnZhciBncm91cCA9IGNvbnNvbGUuZ3JvdXAgfHwgZHVtbXk7XG52YXIgZ3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkIHx8IGR1bW15O1xudmFyIGdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZCB8fCBkdW1teTtcbi8qIGVzbGludC1lbmFibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwID0gbG9nR3JvdXAoZ3JvdXApO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cENvbGxhcHNlZCA9IGxvZ0dyb3VwKGdyb3VwQ29sbGFwc2VkKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBFbmQgPSBsb2dHcm91cChncm91cEVuZCk7XG5cbm1vZHVsZS5leHBvcnRzLnNldExvZ0xldmVsID0gZnVuY3Rpb24obGV2ZWwpIHtcblx0bG9nTGV2ZWwgPSBsZXZlbDtcbn07XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLypnbG9iYWxzIF9fcmVzb3VyY2VRdWVyeSAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcblx0dmFyIGhvdFBvbGxJbnRlcnZhbCA9ICtfX3Jlc291cmNlUXVlcnkuc3Vic3RyKDEpIHx8IDEwICogNjAgKiAxMDAwO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdHZhciBjaGVja0ZvclVwZGF0ZSA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlKGZyb21VcGRhdGUpIHtcblx0XHRpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcblx0XHRcdG1vZHVsZS5ob3Rcblx0XHRcdFx0LmNoZWNrKHRydWUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0aWYgKCF1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdFx0aWYgKGZyb21VcGRhdGUpIGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGUgYXBwbGllZC5cIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlcXVpcmUoXCIuL2xvZy1hcHBseS1yZXN1bHRcIikodXBkYXRlZE1vZHVsZXMsIHVwZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0XHRjaGVja0ZvclVwZGF0ZSh0cnVlKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIChlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcblx0XHRcdFx0XHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcdFx0XHRcdFwiW0hNUl0gVXBkYXRlIGZhaWxlZDogXCIgKyAoZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsImltcG9ydCBtb25nb29zZSA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTtcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSBcIi4uLy4uL2Vudmlyb25tZW50XCI7XG5pbXBvcnQgR2VvUG9pbnRzU2NoZW1hIGZyb20gXCIuL3NjaGVtYXMvZ2VvLXBvaW50cy5kYi5zY2hlbWFcIjtcblxuY29uc3QgbW9uZ29PcHRpb25zID0ge1xuICB1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG4gIHVzZUNyZWF0ZUluZGV4OiB0cnVlXG59O1xuY29uc3QgbW9uZ29kYlVyaSA9IGVudmlyb25tZW50Lm1vbmdvLnVybDtcbm1vbmdvb3NlLnNldChcImRlYnVnXCIsIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIik7XG5jb25zdCBkYiA9IG1vbmdvb3NlLmNyZWF0ZUNvbm5lY3Rpb24obW9uZ29kYlVyaSwgbW9uZ29PcHRpb25zKTtcblxuZGIub24oXCJlcnJvclwiLCBlcnIgPT4ge1xuICBjb25zb2xlLndhcm4oYCR7ZXJyfSwgZGIgY29ubmVjdGlvbm4gZXJyb3IhYCwgeyBsYWJlbDogXCJzdGFydHVwXCIgfSk7XG59KTtcblxuZGIub25jZShcIm9wZW5cIiwgKCkgPT4ge1xuICBjb25zb2xlLmluZm8oXCJkYiBjb25uZWN0aW9uIHN1Y2Nlc3MuLi5cIiwgeyBsYWJlbDogXCJzdGFydHVwXCIgfSk7XG59KTtcblxudHJ5IHtcbiAgZGIubW9kZWwoXCJnZW9wb2ludHNcIik7XG59IGNhdGNoIChlKSB7XG4gIGRiLm1vZGVsKFwiZ2VvcG9pbnRzXCIsIEdlb1BvaW50c1NjaGVtYSk7XG59XG5leHBvcnQgZGVmYXVsdCBkYjtcbiIsImltcG9ydCB7IFNjaGVtYSB9IGZyb20gJ21vbmdvb3NlJztcbmltcG9ydCB7IFBvaW50LCBHZW9tZXRyeUNvbGxlY3Rpb24gfSBmcm9tICdtb25nb29zZS1nZW9qc29uLXNjaGVtYXMnO1xuXG5jb25zdCBHZW9Qb2ludHNTY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgZ2VvbWV0cnk6IFBvaW50XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgR2VvUG9pbnRzU2NoZW1hO1xuIiwiaW1wb3J0IHtFbnRpdHksIFByaW1hcnlHZW5lcmF0ZWRDb2x1bW4sIENvbHVtbn0gZnJvbSBcInR5cGVvcm1cIjtcblxuQEVudGl0eSgpXG5leHBvcnQgY2xhc3MgVXNlciB7XG5cbiAgICBAUHJpbWFyeUdlbmVyYXRlZENvbHVtbigpXG4gICAgaWQ6IG51bWJlcjtcblxuICAgIEBDb2x1bW4oKVxuICAgIGZpcnN0TmFtZTogc3RyaW5nO1xuXG4gICAgQENvbHVtbigpXG4gICAgbGFzdE5hbWU6IHN0cmluZztcblxuICAgIEBDb2x1bW4oKVxuICAgIGFnZTogbnVtYmVyO1xuXG59XG4iLCJjb25zdCBkZWZhdWx0UG9ydCA9IDQwMDA7XG5cbmludGVyZmFjZSBFbnZpcm9ubWVudCB7XG4gIGFwb2xsbzoge1xuICAgIGludHJvc3BlY3Rpb246IGJvb2xlYW47XG4gICAgcGxheWdyb3VuZDogYm9vbGVhbjtcbiAgfTtcbiAgcG9ydDogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIG1vbmdvOiB7XG4gICAgdXJsOiBzdHJpbmdcbiAgfTtcblxuICBhYWRHcmFwaEFwaSA6IHtcbiAgICB0ZW5hbnQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBhdXRob3JpdHlVcmw6c3RyaW5nIHwgdW5kZWZpbmVkIDtcbiAgICBhcHBsaWNhdGlvbklkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgY2xpZW50U2VjcmV0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgcmVzb3VyY2U6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZW52aXJvbm1lbnQ6IEVudmlyb25tZW50ID0ge1xuICBhcG9sbG86IHtcbiAgICBpbnRyb3NwZWN0aW9uOiBwcm9jZXNzLmVudi5BUE9MTE9fSU5UUk9TUEVDVElPTiA9PT0gJ3RydWUnLFxuICAgIHBsYXlncm91bmQ6IHByb2Nlc3MuZW52LkFQT0xMT19QTEFZR1JPVU5EID09PSAndHJ1ZSdcbiAgfSxcbiAgcG9ydDogcHJvY2Vzcy5lbnYuUE9SVCB8fCBkZWZhdWx0UG9ydCxcblxuICBtb25nbzoge1xuICAgIHVybDogYG1vbmdvZGI6Ly8ke3Byb2Nlc3MuZW52Lk1PTkdPX0hPU1R9OiR7cHJvY2Vzcy5lbnYuTU9OR09fUE9SVH0vZ3JhcGhxbGRiYFxuICB9LFxuICBhYWRHcmFwaEFwaSA6IHtcbiAgICB0ZW5hbnQ6IHByb2Nlc3MuZW52LkFBRF9HUkFQSF9BUElfVEVOQU5ULFxuICAgIGF1dGhvcml0eVVybDogYCR7cHJvY2Vzcy5lbnYuQUFEX0dSQVBIX0FQSV9BVVRIT1JJVFlfSE9TVF9VUkx9LyR7cHJvY2Vzcy5lbnYuQUFEX0dSQVBIX0FQSV9URU5BTlR9YCxcbiAgICBhcHBsaWNhdGlvbklkOiBwcm9jZXNzLmVudi5BQURfR1JBUEhfQVBJX0FQUExJQ0FUSU9OX0lELFxuICAgIGNsaWVudFNlY3JldDogcHJvY2Vzcy5lbnYuQUFEX0dSQVBIX0FQSV9DTElFTlRfU0VDUkVULFxuICAgIHJlc291cmNlOiBwcm9jZXNzLmVudi5BQURfR1JBUEhfQVBJX1JFU09VUkNFXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBBdXRoZW50aWNhdGlvbkNvbnRleHQgfSBmcm9tIFwiYWRhbC1ub2RlXCI7XG5cbmltcG9ydCAqIGFzIHJlcXVlc3QgZnJvbSBcInJlcXVlc3RcIjtcblxuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIjtcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSBcIi4uLy4uL2Vudmlyb25tZW50XCI7XG5cblxuLy8gY29uc3QgdXNlcklkID1cImYxNWZmNzUyLWM0MzEtNDFlZC04MjA1LTg2MWVkMWNhNDM3YVwiXG5jb25zdCBiMmNHcmFwaFJlcXVlc3QgPSByZXF1ZXN0LmRlZmF1bHRzKHtcbiAgYmFzZVVybDogYGh0dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvJHtlbnZpcm9ubWVudC5hYWRHcmFwaEFwaS50ZW5hbnR9YFxufSk7XG5jb25zdCB7IGdldCB9ID0gYjJjR3JhcGhSZXF1ZXN0O1xuY29uc3QgW2dldFBtXSA9IFtnZXRdLm1hcChwcm9taXNpZnkpO1xuXG5leHBvcnQgY29uc3QgYjJjR3JhcGhHZXRQaG90byA9IGFzeW5jICh1c2VySWQ6c3RyaW5nKSA9PiB7XG4gIGNvbnN0IHRva2VuOiBhbnkgPSBhd2FpdCBnZXRUb2tlbigpO1xuICByZXR1cm4gYXdhaXQgZ2V0UG0oe1xuICAgIGF1dGg6IHtcbiAgICAgIGJlYXJlcjogdG9rZW5cbiAgICB9LFxuICAgIGVuY29kaW5nOiBudWxsLFxuICAgIHFzOiB7J2FwaS12ZXJzaW9uJzoxLjZ9LFxuICAgIHVybDogYC91c2Vycy8ke3VzZXJJZH0vdGh1bWJuYWlsUGhvdG9gXG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGIyY0dyYXBoVXBsb2FkUGhvdG8gPSBhc3luYyAodXNlcklkOnN0cmluZyxzdHJlYW06IGFueSkgPT4ge1xuICBjb25zdCB0b2tlbjogYW55ID0gYXdhaXQgZ2V0VG9rZW4oKTtcblxuICBjb25zdCBwdXRSZXF1ZXN0ID0gYjJjR3JhcGhSZXF1ZXN0LnB1dCh7XG4gICAgYXV0aDoge1xuICAgICAgYmVhcmVyOiB0b2tlblxuICAgIH0sXG4gICAgcXM6IHsnYXBpLXZlcnNpb24nOjEuNn0sXG4gICAgdXJsOiBgL3VzZXJzLyR7dXNlcklkfS90aHVtYm5haWxQaG90b2AsXG4gIH0pO1xuXG4gIHN0cmVhbS5waXBlKHB1dFJlcXVlc3QpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgcHV0UmVxdWVzdC5vbigncmVzcG9uc2UnLCAocmVzcG9uc2U6IGFueSkgPT4gcmVzb2x2ZShyZXNwb25zZS5zdGF0dXNDb2RlKSk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gZ2V0VG9rZW4oKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgYXV0aENvbnRleHQgPSBuZXcgQXV0aGVudGljYXRpb25Db250ZXh0KDxzdHJpbmc+ZW52aXJvbm1lbnQuYWFkR3JhcGhBcGkuYXV0aG9yaXR5VXJsKTtcbiAgICBhdXRoQ29udGV4dC5hY3F1aXJlVG9rZW5XaXRoQ2xpZW50Q3JlZGVudGlhbHMoXG4gICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLnJlc291cmNlLFxuICAgICAgPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5hcHBsaWNhdGlvbklkLFxuICAgICAgPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5jbGllbnRTZWNyZXQsXG4gICAgICAoZXJyOmFueSwgdG9rZW5SZXM6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh0b2tlblJlcy5hY2Nlc3NUb2tlbik7XG4gICAgICB9XG4gICAgKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSwgUmVxdWVzdE9wdGlvbnMgfSBmcm9tIFwiYXBvbGxvLWRhdGFzb3VyY2UtcmVzdFwiO1xuaW1wb3J0IHsgQXV0aGVudGljYXRpb25Db250ZXh0IH0gZnJvbSBcImFkYWwtbm9kZVwiO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vLi4vZW52aXJvbm1lbnRcIjtcblxuY2xhc3MgQWRCMmNHcmFwaEFQSSBleHRlbmRzIFJFU1REYXRhU291cmNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmJhc2VVUkwgPWBodHRwczovL2dyYXBoLndpbmRvd3MubmV0LyR7ZW52aXJvbm1lbnQuYWFkR3JhcGhBcGkudGVuYW50fWA7XG4gICBcbiAgfVxuXG4gIGFzeW5jIHdpbGxTZW5kUmVxdWVzdChyZXF1ZXN0OiBSZXF1ZXN0T3B0aW9ucykge1xuICAgIGNvbnN0IHRva2VuOiBhbnkgPSBhd2FpdCB0aGlzLmdldFRva2VuKCk7XG4gICAgcmVxdWVzdC5oZWFkZXJzLnNldChcIkF1dGhvcml6YXRpb25cIiwgYEJlYXJlciAke3Rva2VufWApO1xuICAgIHJlcXVlc3QucGFyYW1zLnNldChcImFwaS12ZXJzaW9uXCIsIFwiMS42XCIpO1xuICB9XG5cbiAgYXN5bmMgZ2V0VXNlcih1c2VySWQ6IHN0cmluZykge1xuICAgIHJldHVybiAgYXdhaXQgdGhpcy5nZXQoYC91c2Vycy8ke3VzZXJJZH1gKTsgIFxuICB9XG5cbiAgcHJpdmF0ZSBnZXRUb2tlbigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgYXV0aENvbnRleHQgPSBuZXcgQXV0aGVudGljYXRpb25Db250ZXh0KDxzdHJpbmc+ZW52aXJvbm1lbnQuYWFkR3JhcGhBcGkuYXV0aG9yaXR5VXJsKTtcbiAgICAgIGF1dGhDb250ZXh0LmFjcXVpcmVUb2tlbldpdGhDbGllbnRDcmVkZW50aWFscyhcbiAgICAgICAgPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5yZXNvdXJjZSxcbiAgICAgICAgPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5hcHBsaWNhdGlvbklkLFxuICAgICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLmNsaWVudFNlY3JldCxcbiAgICAgICAgKGVycjphbnksIHRva2VuUmVzOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZSh0b2tlblJlcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWRCMmNHcmFwaEFQSTtcbiIsImltcG9ydCB7IEdyYXBoUUxVcGxvYWQgfSBmcm9tIFwiZ3JhcGhxbC11cGxvYWRcIjtcbmltcG9ydCB7IGIyY0dyYXBoR2V0UGhvdG8sIGIyY0dyYXBoVXBsb2FkUGhvdG8gfSBmcm9tIFwiLi4vLi4vYXBpL2FkYjJjLWdyYXBoLXBob3RvLmFwaVwiO1xuXG5cbmV4cG9ydCBjb25zdCBzY2hlbWEgPSBbXG4gIGBcbiAgc2NhbGFyIFVwbG9hZFxuXG4gIHR5cGUgSW1hZ2Uge1xuICAgIGltYWdlQmFzZTY0IDogU3RyaW5nIVxuICB9XG5cbiAgdHlwZSBVcGxvYWRSZXN1bHQge1xuICAgIHJlc3VsdCA6IFN0cmluZyFcbiAgfVxuXG4gIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICB1c2VyQXZhdGFyOiBJbWFnZVxuICB9XG5cbiAgZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xuICAgIGF2YXRhclVwbG9hZChmaWxlOiBVcGxvYWQhKTogVXBsb2FkUmVzdWx0XG4gIH1cblxuYFxuXTtcblxuZXhwb3J0IGNvbnN0IHR5cGVSZXNvbHZlcnMgPSB7XG4gIFVwbG9hZDogR3JhcGhRTFVwbG9hZFxufTtcbmV4cG9ydCBjb25zdCBxdWVyeVJlc29sdmVycyA9IHtcbiAgdXNlckF2YXRhcjogYXN5bmMgKF86IGFueSwgYXJnczogYW55LCB7IG9pZCB9OiBhbnkpID0+IHtcbiAgICBjb25zdCBnZXRQaG90b1Jlc3VsdCA9IGF3YWl0IGIyY0dyYXBoR2V0UGhvdG8ob2lkKTtcbiAgICBjb25zdCBpbWFnZUZpbGUgPSBnZXRQaG90b1Jlc3VsdC5ib2R5O1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gZ2V0UGhvdG9SZXN1bHQuaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXTtcbiAgICBjb25zdCBidWZmZXJCYXNlNjQgPSBCdWZmZXIuZnJvbShpbWFnZUZpbGUpLnRvU3RyaW5nKFwiYmFzZTY0XCIpO1xuICAgIHJldHVybiB7IGltYWdlQmFzZTY0OiBgZGF0YToke2NvbnRlbnRUeXBlfTtiYXNlNjQsICR7YnVmZmVyQmFzZTY0fWAgfTtcbiAgfVxufTtcblxuY29uc3QgcHJvY2Vzc1VwbG9hZCA9IGFzeW5jICh1c2VySWQ6IHN0cmluZywgdXBsb2FkOiBhbnkpID0+IHtcbiAgY29uc3QgeyBjcmVhdGVSZWFkU3RyZWFtIH0gPSBhd2FpdCB1cGxvYWQ7XG4gIGNvbnN0IHN0cmVhbSA9IGNyZWF0ZVJlYWRTdHJlYW0oKTtcbiAgY29uc3QgYjJjR3JhcGhVcGxvYWRQaG90b1Jlc3VsdCA9IGF3YWl0IGIyY0dyYXBoVXBsb2FkUGhvdG8odXNlcklkLCBzdHJlYW0pO1xuICByZXR1cm4geyByZXN1bHQ6IGIyY0dyYXBoVXBsb2FkUGhvdG9SZXN1bHQgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBtdXRhdGlvblJlc29sdmVycyA9IHtcbiAgYXZhdGFyVXBsb2FkOiAoXzogYW55LCB7IGZpbGUgfTogYW55LCB7IG9pZCB9OiBhbnkpID0+IHtcbiAgICByZXR1cm4gcHJvY2Vzc1VwbG9hZChvaWQsIGZpbGUpO1xuICB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IHNjaGVtYSA9IFtcbiAgYFxuICB0eXBlIFVzZXIge1xuICAgIGNpdHk6ICBTdHJpbmcgXG4gICAgY291bnRyeTogU3RyaW5nIFxuICAgIGRpc3BsYXlOYW1lOiBTdHJpbmcgXG4gICAgZ2l2ZW5OYW1lOiBTdHJpbmdcbiAgICBwb3N0YWxDb2RlOiBTdHJpbmdcbiAgICBlbWFpbDogU3RyaW5nXG4gICAgcHJlZmVycmVkTGFuZ3VhZ2U6IFN0cmluZ1xuICAgIHN0YXRlIDogU3RyaW5nXG4gICAgc3RyZWV0QWRkcmVzczogU3RyaW5nXG5cbiAgfVxuXG4gIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICB1c2VyOiBVc2VyXG4gIH1cblxuYFxuXTtcbmV4cG9ydCBjb25zdCB0eXBlUmVzb2x2ZXJzID0ge307XG5leHBvcnQgY29uc3QgcXVlcnlSZXNvbHZlcnMgPSB7XG4gIHVzZXI6IGFzeW5jIChfOiBhbnksIGFyZ3M6IGFueSwgeyBvaWQsIGRhdGFTb3VyY2VzIH06IGFueSkgPT4ge1xuICAgIGNvbnN0IGdldFVzZXJSZXN1bHQgPSBhd2FpdCBkYXRhU291cmNlcy5hZEIyY0dyYXBoQVBJLmdldFVzZXIob2lkKTtcbiAgICBcblxuICAgIGNvbnN0IHtcbiAgICAgIGNpdHksXG4gICAgICBjb3VudHJ5LFxuICAgICAgZGlzcGxheU5hbWUsXG4gICAgICBnaXZlbk5hbWUsXG4gICAgICBwb3N0YWxDb2RlLFxuICAgICAgc2lnbkluTmFtZXMsXG4gICAgICBwcmVmZXJyZWRMYW5ndWFnZSxcbiAgICAgIHN0YXRlLFxuICAgICAgc3RyZWV0QWRkcmVzcyxcbiAgICB9ID0gZ2V0VXNlclJlc3VsdDtcblxuICAgIGNvbnN0IGVtYWlsID0gc2lnbkluTmFtZXNbMF0udmFsdWVcblxuICAgIHJldHVybiB7XG4gICAgICBjaXR5LFxuICAgICAgY291bnRyeSxcbiAgICAgIGRpc3BsYXlOYW1lLFxuICAgICAgZ2l2ZW5OYW1lLFxuICAgICAgZW1haWwsXG4gICAgICBwb3N0YWxDb2RlLFxuICAgICAgcHJlZmVycmVkTGFuZ3VhZ2UsXG4gICAgICBzdGF0ZSxcbiAgICAgIHN0cmVldEFkZHJlc3MsXG4gICAgfTtcbiAgfVxufTtcbiIsImltcG9ydCB7IG1ha2VFeGVjdXRhYmxlU2NoZW1hIH0gZnJvbSBcImdyYXBocWwtdG9vbHNcIjtcbmltcG9ydCB7XG4gIHNjaGVtYSBhcyBHZW9Qb2ludHNTY2hlbWEsXG4gIHR5cGVSZXNvbHZlcnMgYXMgR2VvUG9pbnRzVHlwZVJlc29sdmVycyxcbiAgcXVlcnlSZXNvbHZlcnMgYXMgR2VvUG9pbnRzUXVlcnlSZXNvbHZlcnNcbn0gZnJvbSBcIi4vZ2VvLXBvaW50cy9nZW8tcG9pbnRzLmdxbC5zY2hlbWFcIjtcbmltcG9ydCB7XG4gIHNjaGVtYSBhcyBBZGIyY0dyYXBoUGhvdG9TY2hlbWEsXG4gIHR5cGVSZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFBob3RvVHlwZVJlc29sdmVycyxcbiAgcXVlcnlSZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFBob3RvUXVlcnlSZXNvbHZlcnMsXG4gIG11dGF0aW9uUmVzb2x2ZXJzIGFzIEFkYjJjR3JhcGhQaG90b011dGF0aW9uUmVzb2x2ZXJzXG59IGZyb20gXCIuL2FkYjJjLWdyYXBoL2FkYjJjLWdyYXBoLXBob3RvLmdxbC5zY2hlbWFcIjtcblxuaW1wb3J0IHtcbiAgc2NoZW1hIGFzIEFkYjJjR3JhcGhVc2VyU2NoZW1hLFxuICB0eXBlUmVzb2x2ZXJzIGFzIEFkYjJjR3JhcGhVc2VyVHlwZVJlc29sdmVycyxcbiAgcXVlcnlSZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFVzZXJRdWVyeVJlc29sdmVyc1xufSBmcm9tIFwiLi9hZGIyYy1ncmFwaC9hZGIyYy1ncmFwaC11c2VyLmdxbC5zY2hlbWFcIjtcblxuY29uc3Qgcm9vdFNjaGVtYSA9IFtcbiAgYFxuICAgIHR5cGUgUXVlcnkge1xuICAgICAgICB0ZXN0TWVzc2FnZTogU3RyaW5nIVxuICAgIH1cblxuICAgIHR5cGUgTXV0YXRpb24ge1xuICAgICAgdGVzdE1lc3NhZ2UobmFtZTogU3RyaW5nKTogU3RyaW5nIVxuICAgIH1cblxuICAgIHNjaGVtYSB7XG4gICAgICBxdWVyeTogUXVlcnkgIFxuICAgICAgbXV0YXRpb246IE11dGF0aW9uXG4gICAgfVxuYFxuXTtcbmNvbnN0IHNjaGVtYSA9IFtcbiAgLi4ucm9vdFNjaGVtYSxcbiAgLi4uR2VvUG9pbnRzU2NoZW1hLFxuICAuLi5BZGIyY0dyYXBoUGhvdG9TY2hlbWEsXG4gIC4uLkFkYjJjR3JhcGhVc2VyU2NoZW1hXG5dO1xuXG5jb25zdCByZXNvbHZlcnMgPSB7XG4gIC4uLkdlb1BvaW50c1R5cGVSZXNvbHZlcnMsXG4gIC4uLkFkYjJjR3JhcGhQaG90b1R5cGVSZXNvbHZlcnMsXG4gIC4uLkFkYjJjR3JhcGhVc2VyVHlwZVJlc29sdmVycyxcblxuICBRdWVyeToge1xuICAgIHRlc3RNZXNzYWdlOiAoKTogc3RyaW5nID0+IHtcbiAgICAgIHJldHVybiBcIkhlbGxvIFdvcmxkIVwiO1xuICAgIH0sXG4gICAgLi4uR2VvUG9pbnRzUXVlcnlSZXNvbHZlcnMsXG4gICAgLi4uQWRiMmNHcmFwaFBob3RvUXVlcnlSZXNvbHZlcnMsXG4gICAgLi4uQWRiMmNHcmFwaFVzZXJRdWVyeVJlc29sdmVyc1xuICB9LFxuXG4gIE11dGF0aW9uOiB7XG4gICAgLi4uQWRiMmNHcmFwaFBob3RvTXV0YXRpb25SZXNvbHZlcnNcbiAgfVxufTtcblxuY29uc3QgZXhlY3V0YWJsZVNjaGVtYSA9IG1ha2VFeGVjdXRhYmxlU2NoZW1hKHtcbiAgdHlwZURlZnM6IHNjaGVtYSxcbiAgcmVzb2x2ZXJzXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZXhlY3V0YWJsZVNjaGVtYTtcbiIsImltcG9ydCB7IEdyYXBoUUxTY2FsYXJUeXBlLCBLaW5kIH0gZnJvbSAnZ3JhcGhxbCc7XG5cbmV4cG9ydCBjb25zdCBjb29yZGluYXRlc1NjYWxhclR5cGUgPSBuZXcgR3JhcGhRTFNjYWxhclR5cGUoe1xuICAgIG5hbWU6ICdDb29yZGluYXRlcycsXG4gICAgZGVzY3JpcHRpb246ICdBIHNldCBvZiBjb29yZGluYXRlcy4geCwgeScsXG4gICAgcGFyc2VWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcbiAgICBzZXJpYWxpemUodmFsdWUgOiBhbnkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIHBhcnNlTGl0ZXJhbChhc3QpIHtcbiAgICAgIGlmKGFzdC5raW5kID09PSBLaW5kLkZMT0FUKXtcbiAgICAgICAgcmV0dXJuIGFzdC52YWx1ZTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgXG4gICAgfSxcbiAgfSkiLCJpbXBvcnQgeyBjb29yZGluYXRlc1NjYWxhclR5cGUgfSBmcm9tICcuL2N1c3RvbS1zY2FsYXJzJztcblxuZXhwb3J0IGNvbnN0IHNjaGVtYSA9IFtcbiAgYFxuICAgIHNjYWxhciBDb29yZGluYXRlc1xuXG4gICAgdHlwZSBQb2ludEdlb21ldHJ5IHtcbiAgICAgICAgdHlwZTogU3RyaW5nIVxuICAgICAgICBjb29yZGluYXRlczogQ29vcmRpbmF0ZXMhXG4gICAgICB9XG5cbiAgICAgIHR5cGUgUG9pbnRQcm9wcyB7XG4gICAgICAgIGlkOiBJbnQhXG4gICAgICAgIGxhdDogRmxvYXRcbiAgICAgICAgbG9uOiBGbG9hdFxuICAgICAgfVxuXG4gICAgICB0eXBlIFBvaW50T2JqZWN0IHtcbiAgICAgICAgdHlwZTogU3RyaW5nIVxuICAgICAgICBnZW9tZXRyeTogUG9pbnRHZW9tZXRyeVxuICAgICAgICBwcm9wZXJ0aWVzOiBQb2ludFByb3BzXG4gICAgICB9XG5cbiAgICAgIHR5cGUgRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgICAgICB0eXBlOiBTdHJpbmchXG4gICAgICAgIGZlYXR1cmVzOiBbUG9pbnRPYmplY3RdXG4gICAgICB9XG5cbiAgICBleHRlbmQgdHlwZSBRdWVyeSB7XG4gICAgIGdldEdlb1BvaW50c0J5Q2F0ZWdvcnk6IEZlYXR1cmVDb2xsZWN0aW9uIVxuICAgIH0gICAgXG4gIGBcbl07XG5cbmNvbnN0IGRhdGEgPSBbXG4gIHsgdmVoaWNsZWlkOiAxLCBsYXRpdHVkZTogNDAuMSwgbG9uZ2l0dWRlOiAtNzYuNSB9LFxuICB7IHZlaGljbGVpZDogMiwgbGF0aXR1ZGU6IDQwLjIsIGxvbmdpdHVkZTogLTc2LjYgfSxcbiAgeyB2ZWhpY2xlaWQ6IDMsIGxhdGl0dWRlOiA0MC4zLCBsb25naXR1ZGU6IC03Ni43IH1cbl07XG5cbmV4cG9ydCBjb25zdCB0eXBlUmVzb2x2ZXJzID0ge1xuICBDb29yZGluYXRlczogY29vcmRpbmF0ZXNTY2FsYXJUeXBlLFxuICBQb2ludEdlb21ldHJ5OiB7XG4gICAgdHlwZSgpIHtcbiAgICAgIHJldHVybiAnUG9pbnQnO1xuICAgIH0sXG4gICAgY29vcmRpbmF0ZXMoaXRlbTogeyBsb25naXR1ZGU6IGFueTsgbGF0aXR1ZGU6IGFueSB9KSB7XG4gICAgICByZXR1cm4gW2l0ZW0ubG9uZ2l0dWRlLCBpdGVtLmxhdGl0dWRlXTtcbiAgICB9XG4gIH0sXG4gIFBvaW50UHJvcHM6IHtcbiAgICBpZChpdGVtOiB7IHZlaGljbGVpZDogYW55IH0pIHtcbiAgICAgIHJldHVybiBpdGVtLnZlaGljbGVpZDtcbiAgICB9LFxuICAgIGxhdChpdGVtOiB7IGxhdGl0dWRlOiBhbnkgfSkge1xuICAgICAgcmV0dXJuIGl0ZW0ubGF0aXR1ZGU7XG4gICAgfSxcbiAgICBsb24oaXRlbTogeyBsb25naXR1ZGU6IGFueSB9KSB7XG4gICAgICByZXR1cm4gaXRlbS5sb25naXR1ZGU7XG4gICAgfVxuICB9LFxuICBQb2ludE9iamVjdDoge1xuICAgIHR5cGUoKSB7XG4gICAgICByZXR1cm4gJ0ZlYXR1cmUnO1xuICAgIH0sXG4gICAgZ2VvbWV0cnkoaXRlbTogYW55KSB7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9LFxuICAgIHByb3BlcnRpZXMoaXRlbTogYW55KSB7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH0sXG4gIEZlYXR1cmVDb2xsZWN0aW9uOiB7XG4gICAgdHlwZSgpIHtcbiAgICAgIHJldHVybiAnRmVhdHVyZUNvbGxlY3Rpb24nO1xuICAgIH0sXG4gICAgZmVhdHVyZXMoZGF0YTogYW55KSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBxdWVyeVJlc29sdmVycyA9IHtcbiAgZ2V0R2VvUG9pbnRzQnlDYXRlZ29yeTogKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn07XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5pbXBvcnQgbW9yZ2FuID0gcmVxdWlyZSgnbW9yZ2FuJyk7XG5pbXBvcnQgY29ycyA9IHJlcXVpcmUoJ2NvcnMnKTtcbmltcG9ydCBwYXNzcG9ydCA9IHJlcXVpcmUoJ3Bhc3Nwb3J0Jyk7XG5pbXBvcnQgeyBjcmVhdGVDb25uZWN0aW9uLCBDb25uZWN0aW9uIH0gZnJvbSAndHlwZW9ybSc7XG5pbXBvcnQgeyBCZWFyZXJTdHJhdGVneSB9IGZyb20gJ3Bhc3Nwb3J0LWF6dXJlLWFkJztcbmltcG9ydCB7IEFwb2xsb1NlcnZlciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcyc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IGRiIGZyb20gJy4vZGIvbW9uZ28vY29uZmlnJztcbmltcG9ydCBleGVjdXRhYmxlU2NoZW1hIGZyb20gJy4vZ3FsL3NjaGVtYXMvZXhlY3V0YWJsZS1zY2hlbWEnO1xuaW1wb3J0IEFkQjJjR3JhcGhBUEkgZnJvbSAnLi9ncWwvZGF0YXNvdXJjZXMvYWRiMmMtZ3JhcGguZGF0YXNvdXJjZSc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi9kYi9tc3NxbC9lbnRpdHkvVXNlcic7XG5cbmNvbnN0IHRlbmFudElEID0gJ3d3ZnNnaGFsdHByb2oub25taWNyb3NvZnQuY29tJztcbmNvbnN0IGNsaWVudElEID0gJzZkMDIzNWMyLTU0ZWMtNDQzNi05YTUwLTdiYzY4ZjA3YzhiYSc7XG5jb25zdCBwb2xpY3lOYW1lID0gJ2IyY18xX3N1c2lfc3RkJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgaWRlbnRpdHlNZXRhZGF0YTpcbiAgICAnaHR0cHM6Ly93d2ZzZ2hhbHRwcm9qLmIyY2xvZ2luLmNvbS8nICtcbiAgICB0ZW5hbnRJRCArXG4gICAgJy92Mi4wLy53ZWxsLWtub3duL29wZW5pZC1jb25maWd1cmF0aW9uLycsXG4gIGNsaWVudElEOiBjbGllbnRJRCxcbiAgcG9saWN5TmFtZTogcG9saWN5TmFtZSxcbiAgaXNCMkM6IHRydWUsXG4gIHZhbGlkYXRlSXNzdWVyOiB0cnVlLFxuICBwYXNzUmVxVG9DYWxsYmFjazogZmFsc2Vcbn07XG5cbmNvbnN0IGJlYXJlclN0cmF0ZWd5ID0gbmV3IEJlYXJlclN0cmF0ZWd5KG9wdGlvbnMsIGZ1bmN0aW9uKHRva2VuLCBkb25lKSB7XG4gIC8vIGNvbnNvbGUubG9nKHRva2VuKTtcbiAgLy8gU2VuZCB1c2VyIGluZm8gdXNpbmcgdGhlIHNlY29uZCBhcmd1bWVudFxuICBkb25lKG51bGwsIHt9LCB0b2tlbik7XG59KTtcblxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xuYXBwLnVzZShtb3JnYW4oJ2RldicpKTtcblxuYXBwLnVzZShwYXNzcG9ydC5pbml0aWFsaXplKCkpO1xucGFzc3BvcnQudXNlKGJlYXJlclN0cmF0ZWd5KTtcblxuYXBwLnVzZShjb3JzKHsgY3JlZGVudGlhbHM6IHRydWUsIG9yaWdpbjogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcgfSkpO1xuYXBwLnVzZShcbiAgJy9hcGknLFxuICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ29hdXRoLWJlYXJlcicsIHsgc2Vzc2lvbjogZmFsc2UgfSksXG4gIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGNsYWltcyA9IHJlcS5hdXRoSW5mbztcbiAgICByZXEudXNlciA9IHtcbiAgICAgIG9pZDogY2xhaW1zLm9pZCxcbiAgICAgIGVtYWlsczogY2xhaW1zLmVtYWlscyxcbiAgICAgIG5hbWU6IGNsYWltcy5uYW1lXG4gICAgfTtcbiAgICBpZiAoY2xhaW1zWydzY3AnXS5zcGxpdCgnICcpLmluZGV4T2YoJ3JlYWQnKSA+PSAwKSB7XG4gICAgICBuZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdJbnZhbGlkIFNjb3BlLCA0MDMnKTtcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5qc29uKHsgZXJyb3I6ICdpbnN1ZmZpY2llbnRfc2NvcGUnIH0pO1xuICAgIH1cbiAgfVxuKTtcblxuY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG4gIHNjaGVtYTogZXhlY3V0YWJsZVNjaGVtYSxcbiAgZGF0YVNvdXJjZXM6ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgYWRCMmNHcmFwaEFQSTogbmV3IEFkQjJjR3JhcGhBUEkoKVxuICAgIH07XG4gIH0sXG4gIGludHJvc3BlY3Rpb246IGVudmlyb25tZW50LmFwb2xsby5pbnRyb3NwZWN0aW9uLFxuICBwbGF5Z3JvdW5kOiBlbnZpcm9ubWVudC5hcG9sbG8ucGxheWdyb3VuZCxcbiAgdXBsb2Fkczoge1xuICAgIC8vIExpbWl0cyBoZXJlIHNob3VsZCBiZSBzdHJpY3RlciB0aGFuIGNvbmZpZyBmb3Igc3Vycm91bmRpbmdcbiAgICAvLyBpbmZyYXN0cnVjdHVyZSBzdWNoIGFzIE5naW54IHNvIGVycm9ycyBjYW4gYmUgaGFuZGxlZCBlbGVnYW50bHkgYnlcbiAgICAvLyBncmFwaHFsLXVwbG9hZDpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vamF5ZGVuc2VyaWMvZ3JhcGhxbC11cGxvYWQjdHlwZS11cGxvYWRvcHRpb25zXG4gICAgbWF4RmlsZVNpemU6IDEwMDAwICogMTAwMCwgLy8gMTAgTUJcbiAgICBtYXhGaWxlczogMjBcbiAgfSxcbiAgY29udGV4dDogKHsgcmVxIH0pID0+IHtcbiAgICByZXR1cm4gcmVxLnVzZXI7XG4gIH1cbn0pO1xuXG5zZXJ2ZXIuYXBwbHlNaWRkbGV3YXJlKHsgYXBwLCBwYXRoOiAnL2FwaScgfSk7IC8vIGFwcCBpcyBmcm9tIGFuIGV4aXN0aW5nIGV4cHJlc3MgYXBwXG5cbmNvbnNvbGUubG9nKF9fZGlybmFtZSlcblxuY3JlYXRlQ29ubmVjdGlvbih7XG4gIFwidHlwZVwiOiBcIm1zc3FsXCIsXG4gIFwiaG9zdFwiOiBcImhhbHRhcHBkYi5kYXRhYmFzZS53aW5kb3dzLm5ldFwiLFxuICBcInVzZXJuYW1lXCI6IFwiaGFsbHRhcHBfZGJfYWRtaW5cIixcbiAgXCJwYXNzd29yZFwiOiBcIlBAc3N3b3JkXCIsXG4gIFwiZGF0YWJhc2VcIjogXCJoYWx0YXBwZGV2ZGJcIixcbiAgXCJzeW5jaHJvbml6ZVwiOiB0cnVlLFxuICBcImxvZ2dpbmdcIjogZmFsc2UsXG4gIFwib3B0aW9uc1wiIDoge1xuICAgICBcImVuY3J5cHRcIiA6IHRydWVcbiAgfSxcbiAgXCJlbnRpdGllc1wiIDogW1VzZXJdXG59XG4gIClcbiAgLnRoZW4oYXN5bmMgKGNvbm5lY3Rpb246IENvbm5lY3Rpb24pID0+IHtcbiAgICBkYi5vbmNlKCdvcGVuJywgKCkgPT4ge1xuICAgICAgYXBwLmxpc3Rlbih7IHBvcnQ6IGVudmlyb25tZW50LnBvcnQgfSwgKCkgPT5cbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgYPCfmoAgQ29ubmVjdGVkIHRvIGRhdGFiYXNlIGFuZCBTZXJ2ZXIgcmVhZHkgYXQgaHR0cDovL2xvY2FsaG9zdDo0MDAwJHtcbiAgICAgICAgICAgIHNlcnZlci5ncmFwaHFsUGF0aFxuICAgICAgICAgIH1gXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnSW5zZXJ0aW5nIGEgbmV3IHVzZXIgaW50byB0aGUgZGF0YWJhc2UuLi4nKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoKTtcbiAgICB1c2VyLmZpcnN0TmFtZSA9ICdUaW1iZXInO1xuICAgIHVzZXIubGFzdE5hbWUgPSAnU2F3JztcbiAgICB1c2VyLmFnZSA9IDI1O1xuICAgIGF3YWl0IGNvbm5lY3Rpb24ubWFuYWdlci5zYXZlKHVzZXIpO1xuICAgIGNvbnNvbGUubG9nKCdTYXZlZCBhIG5ldyB1c2VyIHdpdGggaWQ6ICcgKyB1c2VyLmlkKTtcblxuICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIHVzZXJzIGZyb20gdGhlIGRhdGFiYXNlLi4uJyk7XG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCBjb25uZWN0aW9uLm1hbmFnZXIuZmluZChVc2VyKTtcbiAgICBjb25zb2xlLmxvZygnTG9hZGVkIHVzZXJzOiAnLCB1c2Vycyk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnSGVyZSB5b3UgY2FuIHNldHVwIGFuZCBydW4gZXhwcmVzcy9rb2EvYW55IG90aGVyIGZyYW1ld29yay4nKTtcbiAgfSlcbiAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG5cbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gIG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiBzZXJ2ZXIuc3RvcCgpKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFkYWwtbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsLXRvb2xzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtdXBsb2FkXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvb3NlLWdlb2pzb24tc2NoZW1hc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb3JnYW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGFzc3BvcnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGFzc3BvcnQtYXp1cmUtYWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVmbGVjdC1tZXRhZGF0YVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZXF1ZXN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR5cGVvcm1cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9