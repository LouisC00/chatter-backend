"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubModule = void 0;
const common_1 = require("@nestjs/common");
const injection_tokens_1 = require("../constants/injection-tokens");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const config_1 = require("@nestjs/config");
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const ioredis_1 = require("ioredis");
const reviver_1 = require("./reviver");
let PubSubModule = class PubSubModule {
};
exports.PubSubModule = PubSubModule;
exports.PubSubModule = PubSubModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: injection_tokens_1.PUB_SUB,
                useFactory: (configService) => {
                    if (configService.get('NODE_ENV') === 'production') {
                        const options = {
                            host: configService.getOrThrow('REDIS_HOST'),
                            port: configService.getOrThrow('REDIS_PORT')
                        };
                        return new graphql_redis_subscriptions_1.RedisPubSub({
                            publisher: new ioredis_1.default(options),
                            subscriber: new ioredis_1.default(options),
                            reviver: reviver_1.reviver
                        });
                    }
                    return new graphql_subscriptions_1.PubSub();
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [injection_tokens_1.PUB_SUB],
    })
], PubSubModule);
//# sourceMappingURL=pubsub.module.js.map