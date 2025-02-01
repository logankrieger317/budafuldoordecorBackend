import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('orders', 'phone', {
    type: DataTypes.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('orders', 'notes', {
    type: DataTypes.TEXT,
    allowNull: true
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('orders', 'phone');
  await queryInterface.removeColumn('orders', 'notes');
}
