'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Helper function to check if table exists
    const tableExists = async (tableName) => {
      try {
        await queryInterface.describeTable(tableName);
        return true;
      } catch (error) {
        return false;
      }
    };

    // Base product fields that all product tables will have
    const baseFields = {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    };

    // Create ribbon products table
    if (!(await tableExists('ribbon_products'))) {
      await queryInterface.createTable('ribbon_products', {
        ...baseFields,
        ribbonLength: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ribbonWidth: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ribbonColors: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
        },
        ribbonPattern: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      });
    }

    // Create mum products table
    if (!(await tableExists('mum_products'))) {
      await queryInterface.createTable('mum_products', {
        ...baseFields,
        size: {
          type: Sequelize.ENUM('small', 'medium', 'large', 'extra-large'),
          allowNull: false,
        },
        baseColors: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
        },
        accentColors: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
        },
        hasLights: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      });
    }

    // Create braid products table
    if (!(await tableExists('braid_products'))) {
      await queryInterface.createTable('braid_products', {
        ...baseFields,
        braidLength: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        braidColors: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
        },
        braidPattern: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      });
    }

    // Create wreath products table
    if (!(await tableExists('wreath_products'))) {
      await queryInterface.createTable('wreath_products', {
        ...baseFields,
        diameter: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        baseType: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        season: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        decorations: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
        },
      });
    }

    // Create seasonal products table
    if (!(await tableExists('seasonal_products'))) {
      await queryInterface.createTable('seasonal_products', {
        ...baseFields,
        season: {
          type: Sequelize.ENUM('spring', 'summer', 'fall', 'winter', 'holiday'),
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        theme: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order
    await queryInterface.dropTable('seasonal_products', { cascade: true });
    await queryInterface.dropTable('wreath_products', { cascade: true });
    await queryInterface.dropTable('braid_products', { cascade: true });
    await queryInterface.dropTable('mum_products', { cascade: true });
    await queryInterface.dropTable('ribbon_products', { cascade: true });
  },
};
