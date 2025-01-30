import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('products', 'color', {
    type: DataTypes.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('products', 'brand', {
    type: DataTypes.STRING,
    allowNull: true
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('products', 'color');
  await queryInterface.removeColumn('products', 'brand');
}
