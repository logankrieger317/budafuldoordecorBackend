import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('Products', 'color', {
    type: DataTypes.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('Products', 'brand', {
    type: DataTypes.STRING,
    allowNull: true
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('Products', 'color');
  await queryInterface.removeColumn('Products', 'brand');
}
