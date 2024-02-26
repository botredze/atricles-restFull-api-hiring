import {CacheManager} from "./cache.manager";
import {Module} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";

@Module({
    providers: [CacheManager],
    exports: [CacheManager],
})
export class CacheModuleData {}
