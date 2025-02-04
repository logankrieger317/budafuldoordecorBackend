import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('orders', 'userId', {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });

  // Create an index for faster lookups
  await queryInterface.addIndex('orders', ['userId']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('orders', 'userId');
}
