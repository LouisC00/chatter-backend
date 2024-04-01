import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, database, up } from 'migrate-mongo';

@Injectable()
export class DbMigrationService implements OnModuleInit {
  private readonly dbMigrationConfig: Partial<config.Config> = {
    mongodb: {
      databaseName: this.configService.getOrThrow('DB_NAME'),
      url: this.configService.getOrThrow('MONGODB_URI'),
    },
    migrationsDir: `${__dirname}/../../migrations`,
    changelogCollectionName: 'changelog',
    migrationFileExtension: '.js',
  };

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      config.set(this.dbMigrationConfig);
      const { db, client } = await database.connect();
      await up(db, client);
      client.close(); // Close the database connection
    } catch (error) {
      console.error('Migration error:', error);
      process.exit(1); // Exit the process with an error code
    }
  }
}
