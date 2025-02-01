import { QueryInterface, DataTypes } from 'sequelize';

async function columnExists(queryInterface: QueryInterface, tableName: string, columnName: string): Promise<boolean> {
  const tableDescription = await queryInterface.describeTable(tableName);
  return columnName in tableDescription;
}

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Check and add color column
  const hasColorColumn = await columnExists(queryInterface, 'products', 'color');
  if (!hasColorColumn) {
    await queryInterface.addColumn('products', 'color', {
      type: DataTypes.STRING,
      allowNull: true
    });
  }

  // Check and add brand column
  const hasBrandColumn = await columnExists(queryInterface, 'products', 'brand');
  if (!hasBrandColumn) {
    await queryInterface.addColumn('products', 'brand', {
      type: DataTypes.STRING,
      allowNull: true
    });
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Check and remove color column
  const hasColorColumn = await columnExists(queryInterface, 'products', 'color');
  if (hasColorColumn) {
    await queryInterface.removeColumn('products', 'color');
  }

  // Check and remove brand column
  const hasBrandColumn = await columnExists(queryInterface, 'products', 'brand');
  if (hasBrandColumn) {
    await queryInterface.removeColumn('products', 'brand');
  }
}
